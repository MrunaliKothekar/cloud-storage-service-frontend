import { useEffect, useState } from "react";
import { ArrowUpRight, FileText, Folder, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getStars, unstar } from "../api/stars";
import { downloadFile } from "../api/files";
import { useToast } from "../components/Toast";
import { formatBytes } from "../lib/format";

export default function Starred() {
  const [items, setItems] = useState([]);
  const { push } = useToast();

  async function load() {
    try {
      const r = await getStars();
      setItems(r.data.stars || []);
    } catch (e) {
      push(e.response?.data?.message || "Could not load starred items");
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(x) {
    try {
      await unstar({ resourceType: x.resource_type, resourceId: x.resource_id });
      push("Removed from starred");
      load();
    } catch (e) {
      push(e.response?.data?.message || "Could not remove star");
    }
  }

  async function download(x) {
    try {
      const r = await downloadFile(x.resource_id);
      const url = r.data.downloadUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      push(e.response?.data?.message || "Could not download file");
    }
  }

  return (
    <div className="fade-in space-y-7">
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-black/35">Saved for later</div>
        <h1 className="font-display text-5xl mt-2">Starred</h1>
      </div>

      <div className="bg-white border border-[#dedfd7] rounded-2xl overflow-hidden">
        {items.length ? items.map(x => (
          <div key={`${x.resource_type}:${x.resource_id}`} className="p-4 flex items-center gap-4 border-b last:border-0">
            <div className="w-10 h-10 rounded-xl bg-[#eff5ce] grid place-items-center">
              {x.resource_type === "folder" ? <Folder size={18}/> : <FileText size={18}/>}
            </div>
            <div className="flex-1 min-w-0 text-sm">
              <div className="font-medium truncate">{x.name || x.resource_id}</div>
              <div className="text-xs text-black/35">
                {x.resource_type === "folder" ? "Folder" : formatBytes(x.size_bytes)}
              </div>
            </div>
            {x.resource_type === "folder" ? (
              <Link to={`/files/${x.resource_id}`} className="p-2"><ArrowUpRight size={17}/></Link>
            ) : (
              <button onClick={() => download(x)} className="p-2"><ArrowUpRight size={17}/></button>
            )}
            <button onClick={() => remove(x)} title="Remove star">
              <Star size={18} fill="currentColor"/>
            </button>
          </div>
        )) : (
          <div className="p-14 text-center text-black/35">Nothing starred yet.</div>
        )}
      </div>
    </div>
  );
}
