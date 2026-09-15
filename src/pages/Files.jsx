import { useEffect, useState } from "react";
import { FolderPlus, LayoutGrid, List, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRootContents, getFolder, updateFolder, deleteFolder
} from "../api/folders";
import {
  updateFile, deleteFile, downloadFile
} from "../api/files";
import { getStars, star, unstar } from "../api/stars";
import { formatBytes, getErrorMessage } from "../lib/format";
import Breadcrumbs from "../components/Breadcrumbs";
import ItemCard from "../components/ItemCard";
import UploadModal from "../components/UploadModal";
import CreateFolderModal from "../components/CreateFolderModal";
import FolderPickerModal from "../components/FolderPickerModal";
import ShareModal from "../components/ShareModal";
import LinkModal from "../components/LinkModal";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const emptyData = {
  folder: null,
  children: { folders: [], files: [] },
  path: [],
};

export default function Files() {
  const { id } = useParams();
  const nav = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();

  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [upload, setUpload] = useState(false);
  const [newFolder, setNewFolder] = useState(false);
  const [rename, setRename] = useState(null);
  const [move, setMove] = useState(null);
  const [share, setShare] = useState(null);
  const [link, setLink] = useState(null);
  const [name, setName] = useState("");
  const [view, setView] = useState("grid");
  const [starred, setStarred] = useState(new Set());

  async function load() {
    setLoading(true);
    try {
      const [contents, starsResponse] = await Promise.all([
        id ? getFolder(id) : getRootContents(),
        getStars(),
      ]);
      setData(contents.data);
      setStarred(
        new Set(
          (starsResponse.data.stars || []).map(
            (x) => `${x.resource_type}:${x.resource_id}`
          )
        )
      );
    } catch (e) {
      push(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const folders = data.children?.folders || [];
  const files = data.children?.files || [];

  async function renameItem() {
    if (!rename || !name.trim()) return;
    try {
      if (rename.type === "folder") {
        await updateFolder(rename.id, { name: name.trim() });
      } else {
        await updateFile(rename.id, { name: name.trim() });
      }
      push("Renamed successfully");
      setRename(null);
      await load();
    } catch (e) {
      push(getErrorMessage(e));
    }
  }

  async function remove(item, type) {
    if (!window.confirm(`Move "${item.name}" to trash?`)) return;
    try {
      if (type === "folder") await deleteFolder(item.id);
      else await deleteFile(item.id);
      push("Moved to trash");
      await load();
    } catch (e) {
      push(getErrorMessage(e));
    }
  }

  async function download(id) {
    try {
      const r = await downloadFile(id);
      const url = r.data.downloadUrl || r.data.url || r.data.signedUrl;
      if (!url) throw new Error("Download URL was not returned.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      push(getErrorMessage(e));
    }
  }

  async function toggleStar(item, type) {
    const key = `${type}:${item.id}`;
    try {
      if (starred.has(key)) {
        await unstar({ resourceType: type, resourceId: item.id });
        push("Removed from starred");
        setStarred((prev) => {
          const next = new Set(prev); next.delete(key); return next;
        });
      } else {
        await star({ resourceType: type, resourceId: item.id });
        push("Added to starred");
        setStarred((prev) => new Set(prev).add(key));
      }
    } catch (e) {
      push(getErrorMessage(e));
    }
  }

  function actions(item, type) {
    return {
      onRename: () => {
        setRename({ id: item.id, type });
        setName(item.name);
      },
      onMove: () => setMove({ item, type }),
      onDelete: () => remove(item, type),
      onDownload: type === "file" ? () => download(item.id) : undefined,
      onShare: () => setShare({ item, type }),
      onLink: () => setLink({ item, type }),
      onStar: () => toggleStar(item, type),
    };
  }

  return (
    <div className="fade-in space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Breadcrumbs path={data.path || []} />
          <h1 className="font-display text-5xl mt-3">
            {data.folder?.name || "My files"}
          </h1>
          <p className="text-sm text-black/40 mt-1">
            {folders.length} folders · {files.length} files
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setNewFolder(true)}
            className="h-11 px-4 rounded-xl border border-[#d6d7cf] bg-white flex gap-2 items-center text-sm"
          >
            <FolderPlus size={17} /> New folder
          </button>
          <button
            onClick={() => setUpload(true)}
            className="h-11 px-4 rounded-xl bg-[#20221e] text-white flex gap-2 items-center text-sm"
          >
            <UploadCloud size={17} /> Upload
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#dedfd7] pb-3">
        <div className="text-xs uppercase tracking-wider text-black/35">
          Contents
        </div>
        <div className="flex bg-white border border-[#dedfd7] rounded-lg p-1">
          <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-black/5" : ""}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-black/5" : ""}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-36 rounded-2xl skeleton" />)}
        </div>
      ) : !folders.length && !files.length ? (
        <div className="py-24 text-center">
          <div className="font-display text-4xl">Nothing here yet.</div>
          <p className="text-sm text-black/40 mt-2">
            Create a folder or upload your first file.
          </p>
        </div>
      ) : (
        <div className={view === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-4 gap-4" : "grid gap-2"}>
          {folders.map((f) => (
            <ItemCard
              key={f.id}
              item={f}
              folder
              canManage={f.owner_id === user?.id}
              starred={starred.has(`folder:${f.id}`)}
              onClick={() => nav(`/files/${f.id}`)}
              {...actions(f, "folder")}
            />
          ))}
          {files.map((f) => (
            <ItemCard
              key={f.id}
              item={f}
              canManage={f.owner_id === user?.id}
              starred={starred.has(`file:${f.id}`)}
              onClick={() => download(f.id)}
              {...actions(f, "file")}
            />
          ))}
        </div>
      )}

      <UploadModal
        open={upload}
        onClose={() => setUpload(false)}
        folderId={id || null}
        onDone={() => { push("Upload completed"); load(); }}
      />

      <CreateFolderModal
        open={newFolder}
        onClose={() => setNewFolder(false)}
        parentId={id || null}
        onDone={() => { push("Folder created"); load(); }}
      />

      <FolderPickerModal
        open={!!move}
        currentId={move?.item?.id}
        onClose={() => setMove(null)}
        onSelect={async (folderId) => {
          if (!move) return;
          try {
            const payload = { folderId };
            if (move.type === "folder") {
              await updateFolder(move.item.id, payload);
            } else {
              await updateFile(move.item.id, payload);
            }
            setMove(null);
            push("Moved successfully");
            await load();
          } catch (e) {
            push(getErrorMessage(e));
          }
        }}
      />

      <ShareModal
        open={!!share}
        item={share?.item}
        type={share?.type}
        onClose={() => setShare(null)}
        onDone={() => push("Resource shared")}
      />

      <LinkModal
        open={!!link}
        item={link?.item}
        type={link?.type}
        onClose={() => setLink(null)}
      />

      <Modal
        open={!!rename}
        onClose={() => setRename(null)}
        title={`Rename ${rename?.type || ""}`}
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && renameItem()}
          className="w-full h-12 rounded-xl border border-[#d6d7cf] px-4 bg-white outline-none"
        />
        <button
          onClick={renameItem}
          className="w-full h-12 rounded-xl bg-[#20221e] text-white mt-4"
        >
          Save changes
        </button>
      </Modal>
    </div>
  );
}
