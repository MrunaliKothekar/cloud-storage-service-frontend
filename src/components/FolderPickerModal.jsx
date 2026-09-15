import { useEffect, useState } from "react";
import { ChevronRight, Folder, Home } from "lucide-react";
import Modal from "./Modal";
import { getRootContents, getFolder } from "../api/folders";
import { getErrorMessage } from "../lib/format";

export default function FolderPickerModal({ open, onClose, onSelect, currentId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRoot() {
    setLoading(true); setError("");
    try {
      const r = await getRootContents();
      setItems((r.data.children?.folders || []).map(x => ({ ...x, level: 0 })));
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (open) loadRoot();
  }, [open]);

  async function expand(folder) {
    if (folder.loaded) {
      setItems(prev => prev.filter(x => !(x.parentDisplayId === folder.id)));
      setItems(prev => prev.map(x => x.id === folder.id ? { ...x, loaded: false } : x));
      return;
    }
    try {
      const r = await getFolder(folder.id);
      const children = (r.data.children?.folders || []).map(x => ({
        ...x, level: (folder.level || 0) + 1, parentDisplayId: folder.id
      }));
      setItems(prev => {
        const index = prev.findIndex(x => x.id === folder.id);
        return [...prev.slice(0, index + 1), ...children, ...prev.slice(index + 1)]
          .map(x => x.id === folder.id ? { ...x, loaded: true } : x);
      });
    } catch (e) { setError(getErrorMessage(e)); }
  }

  return (
    <Modal open={open} onClose={onClose} title="Move to folder">
      <button
        type="button"
        disabled={currentId === null}
        onClick={() => onSelect?.(null)}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f3f3ee] text-left disabled:opacity-40"
      >
        <Home size={18} /><span className="font-medium text-sm">My files (root)</span>
      </button>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <div className="mt-3 max-h-72 overflow-auto space-y-1">
        {loading ? <div className="p-4 text-sm text-black/40">Loading folders...</div> :
          items.map(folder => (
            <div key={`${folder.id}-${folder.level}`} style={{ paddingLeft: `${(folder.level || 0) * 20}px` }} className="flex items-center gap-1">
              <button type="button" onClick={() => expand(folder)} className="w-7 h-8 grid place-items-center rounded hover:bg-black/5">
                <ChevronRight size={15} className={folder.loaded ? "rotate-90" : ""} />
              </button>
              <button
                type="button"
                disabled={folder.id === currentId}
                onClick={() => onSelect?.(folder.id)}
                className="flex-1 flex items-center gap-3 p-2 rounded-lg hover:bg-[#f3f3ee] text-left disabled:opacity-40"
              >
                <Folder size={17} className="text-[#8d9e37]" fill="currentColor" />
                <span className="text-sm truncate">{folder.name}</span>
              </button>
            </div>
          ))}
      </div>
    </Modal>
  );
}
