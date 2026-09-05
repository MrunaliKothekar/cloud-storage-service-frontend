import { useState } from "react";
import Modal from "./Modal";
import { createFolder } from "../api/folders";
import { getErrorMessage } from "../lib/format";

export default function CreateFolderModal({ open, onClose, parentId = null, onDone }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createFolder({ name: name.trim(), parentId });
      setName("");
      onClose();
      onDone?.();
    } catch (e) {
      alert(getErrorMessage(e));
    } finally { setSaving(false); }
  }

  return <Modal open={open} onClose={onClose} title="Create a new folder">
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="text-xs uppercase tracking-wider text-black/45">Folder name</label>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Project assets"
          className="mt-2 w-full h-12 rounded-xl border border-[#d6d7cf] bg-white px-4 outline-none focus:border-[#8c9d38]"/>
      </div>
      <button disabled={saving} className="w-full h-12 rounded-xl bg-[#20221e] text-white font-semibold disabled:opacity-50">
        {saving ? "Creating..." : "Create folder"}
      </button>
    </form>
  </Modal>;
}
