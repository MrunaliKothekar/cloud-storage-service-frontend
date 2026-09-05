import { Folder, FileText, Image as ImageIcon, FileArchive, Film, Music2, MoreHorizontal } from "lucide-react";
import { fileExtension, formatBytes } from "../lib/format";

function iconFor(name = "", folder = false) {
  if (folder) return <Folder size={22} fill="currentColor" className="text-[#8d9e37]"/>;
  const ext = fileExtension(name);
  if (["PNG","JPG","JPEG","WEBP","GIF"].includes(ext)) return <ImageIcon size={22}/>;
  if (["MP4","MOV","AVI"].includes(ext)) return <Film size={22}/>;
  if (["MP3","WAV"].includes(ext)) return <Music2 size={22}/>;
  if (["ZIP","RAR","7Z"].includes(ext)) return <FileArchive size={22}/>;
  return <FileText size={22}/>;
}

export default function ItemCard({ item, folder = false, onClick, onMenu }) {
  return <div onDoubleClick={onClick} className="group bg-white border border-[#dedfd7] rounded-2xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="w-11 h-11 rounded-xl bg-[#f0f1e9] grid place-items-center">{iconFor(item.name, folder)}</div>
      <button onClick={e => {e.stopPropagation(); onMenu?.(item)}} className="opacity-0 group-hover:opacity-100 w-8 h-8 grid place-items-center rounded-lg hover:bg-black/5"><MoreHorizontal size={18}/></button>
    </div>
    <div className="mt-5">
      <div className="font-medium text-sm truncate">{item.name}</div>
      <div className="text-xs text-black/40 mt-1">{folder ? "Folder" : formatBytes(item.size)}</div>
    </div>
  </div>;
}
