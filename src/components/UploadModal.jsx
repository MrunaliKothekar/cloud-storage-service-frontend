import { useRef, useState } from "react";
import Modal from "./Modal";
import {
  initUpload,
  getUploadUrl,
  completeUpload,
} from "../api/files";
import { formatBytes, getErrorMessage } from "../lib/format";

export default function UploadModal({
  open,
  onClose,
  folderId = null,
  onDone,
}) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState("");

  function selectFiles(selectedFiles) {
    const selected = Array.from(selectedFiles || []);
    const MAX_SIZE = 50 * 1024 * 1024;
    const oversized = selected.find((file) => file.size <= 0 || file.size > MAX_SIZE);

    setError(
      oversized
        ? `"${oversized.name}" is larger than the 50 MB limit.`
        : ""
    );
    setFiles(oversized ? selected.filter((file) => file.size > 0 && file.size <= MAX_SIZE) : selected);
    setProgress({});
  }

  async function uploadOne(file, index) {
    // ----------------------------------------
    // STEP 1: Initialize upload
    // ----------------------------------------

    setProgress((prev) => ({
      ...prev,
      [index]: 10,
    }));

    const mimeType =
      file.type || "application/octet-stream";

    console.log("Uploading:", {
      name: file.name,
      size: file.size,
      sizeMB: file.size / (1024 * 1024),
      type: mimeType,
      folderId,
    });

    const initResponse = await initUpload({
      name: file.name,
      sizeBytes: file.size,
      mimeType,
      folderId,
    });

    const meta = initResponse.data.upload ?? initResponse.data;

    console.log("Upload initialized:", meta);

    setProgress((prev) => ({
      ...prev,
      [index]: 25,
    }));

    // ----------------------------------------
    // STEP 2: Get Supabase signed URL
    // ----------------------------------------

    const signedResponse = await getUploadUrl({
      storageKey: meta.storageKey,
    });

    const signedUrl =
      signedResponse.data.upload?.signedUrl ??
      signedResponse.data.signedUrl;

    if (!signedUrl) {
      throw new Error(
        "Upload URL was not returned by the server."
      );
    }

    setProgress((prev) => ({
      ...prev,
      [index]: 40,
    }));

    // ----------------------------------------
    // STEP 3: Upload directly to Supabase
    // ----------------------------------------

    const uploadResponse = await fetch(
      signedUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type": mimeType,
        },
        body: file,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(
        `Storage upload failed (${uploadResponse.status})`
      );
    }

    setProgress((prev) => ({
      ...prev,
      [index]: 75,
    }));

    // ----------------------------------------
    // STEP 4: Complete upload
    // ----------------------------------------

    await completeUpload({
      fileId: meta.fileId,
      storageKey: meta.storageKey,
      name: file.name,
      sizeBytes: file.size,
      mimeType,
      folderId,
    });

    setProgress((prev) => ({
      ...prev,
      [index]: 100,
    }));
  }

  async function startUpload() {
    if (!files.length || uploading) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadOne(files[i], i);
      }

      onDone?.();

      setFiles([]);

      setTimeout(() => {
        onClose?.();
      }, 300);
    } catch (error) {
      console.error("Upload error:", error);

      setError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function handleClose() {
    if (uploading) {
      return;
    }

    setFiles([]);
    setError("");
    setProgress({});
    onClose?.();
  }

  return (
    <Modal
      open={open}
      onClose={uploading ? undefined : handleClose}
      title="Upload to Cloudroom"
    >
      {/* DROP ZONE */}

      <div
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          selectFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="
          border-2
          border-dashed
          border-[#cfd0c8]
          hover:border-[#8f9d48]
          rounded-2xl
          p-8
          text-center
          cursor-pointer
          bg-white
          transition
        "
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            selectFiles(event.target.files);
          }}
        />

        <div className="
          w-12
          h-12
          rounded-2xl
          bg-[#eff5ce]
          grid
          place-items-center
          mx-auto
        ">
          <span className="text-2xl">
            ↑
          </span>
        </div>

        <h3 className="mt-4 font-semibold">
          Drop files here
        </h3>

        <p className="text-sm text-black/45 mt-1">
          or click to browse · up to 50 MB each
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="
          mt-4
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
        ">
          {error}
        </div>
      )}

      {/* FILE LIST */}

      {files.length > 0 && (
        <div className="
          mt-5
          space-y-2
          max-h-52
          overflow-auto
        ">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="
                bg-white
                border
                border-[#dedfd7]
                rounded-xl
                p-3
              "
            >
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate">
                  {file.name}
                </span>

                <span className="text-black/40 whitespace-nowrap">
                  {formatBytes(file.size)}
                </span>
              </div>

              {uploading && (
                <div className="
                  h-1
                  bg-black/5
                  rounded-full
                  mt-2
                  overflow-hidden
                ">
                  <div
                    className="
                      h-full
                      bg-[#9bad3d]
                      rounded-full
                      transition-all
                    "
                    style={{
                      width: `${progress[index] || 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD BUTTON */}

      <button
        onClick={startUpload}
        disabled={!files.length || uploading}
        className="
          mt-5
          w-full
          h-12
          rounded-xl
          bg-[#20221e]
          text-white
          font-semibold
          disabled:opacity-40
          transition
        "
      >
        {uploading
          ? "Uploading..."
          : `Upload ${files.length || ""} ${
              files.length === 1 ? "file" : "files"
            }`}
      </button>
    </Modal>
  );
}