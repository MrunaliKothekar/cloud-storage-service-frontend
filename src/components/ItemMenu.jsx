import { useEffect, useRef } from "react";
import { Download, Link2, Pencil, Share2, Star, Trash2 } from "lucide-react";

export default function ItemMenu({ item, type, onRename, onMove, onDelete, onDownload, onShare, onLink, onStar }) {
  const ref = useRef(null);
  useEffect(() => {
    const close = e => { if (!ref.current?.contains(e.target)) ref.current?.removeAttribute("data-open"); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const run = (fn) => fn?.();

  return <div ref={ref} className="relative">
    <button onClick={() => ref.current?.setAttribute("data-open","1")} className="w-9 h-9 rounded-lg hover:bg-black/5">•••</button>
    <div className="hidden [data-open='1']:block absolute right-0 top-10 z-20 w-48 bg-white border border-[#dddeda] rounded-xl shadow-xl p-1">
      {type === "file" && <button onClick={() => run(onDownload)} className="menu"><Download size={15}/> Download</button>}
      <button onClick={() => run(onRename)} className="menu"><Pencil size={15}/> Rename</button>
      <button onClick={() => run(onMove)} className="menu"><Link2 size={15}/> Move</button>
      {type === "file" && <button onClick={() => run(onStar)} className="menu"><Star size={15}/> Star</button>}
      <button onClick={() => run(onShare)} className="menu"><Share2 size={15}/> Share</button>
      <button onClick={() => run(onLink)} className="menu"><Link2 size={15}/> Public link</button>
      <button onClick={() => run(onDelete)} className="menu text-red-600"><Trash2 size={15}/> Move to trash</button>
    </div>
  </div>;
}
