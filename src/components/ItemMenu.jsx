import { useEffect, useRef, useState } from "react";
import { Download, Link2, Pencil, Share2, Star, Trash2, Move } from "lucide-react";

export default function ItemMenu({
  type, canManage = true, onRename, onMove, onDelete, onDownload, onShare, onLink, onStar
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const run = (fn) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-9 h-9 rounded-lg hover:bg-black/5 text-lg"
        aria-label="Item actions"
      >
        •••
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-40 w-48 bg-white border border-[#dddeda] rounded-xl shadow-xl p-1">
          {type === "file" && (
            <MenuButton onClick={() => run(onDownload)} icon={<Download size={15} />}>Download</MenuButton>
          )}
          {canManage && <>
            <MenuButton onClick={() => run(onRename)} icon={<Pencil size={15} />}>Rename</MenuButton>
            <MenuButton onClick={() => run(onMove)} icon={<Move size={15} />}>Move</MenuButton>
            <MenuButton onClick={() => run(onStar)} icon={<Star size={15} />}>Star / unstar</MenuButton>
            <MenuButton onClick={() => run(onShare)} icon={<Share2 size={15} />}>Share</MenuButton>
            <MenuButton onClick={() => run(onLink)} icon={<Link2 size={15} />}>Public link</MenuButton>
            <MenuButton danger onClick={() => run(onDelete)} icon={<Trash2 size={15} />}>Move to trash</MenuButton>
          </> }

        </div>
      )}
    </div>
  );
}

function MenuButton({ children, icon, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-left hover:bg-[#f3f3ee] ${danger ? "text-red-600" : ""}`}
    >
      {icon}{children}
    </button>
  );
}
