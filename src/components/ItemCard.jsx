import {
  Folder, FileText, Image as ImageIcon, FileArchive, Film, Music2, Star
} from "lucide-react";
import { fileExtension, formatBytes } from "../lib/format";
import ItemMenu from "./ItemMenu";

function iconFor(name = "", folder = false) {
  if (folder) return <Folder size={22} fill="currentColor" className="text-[#8d9e37]" />;
  const ext = fileExtension(name);
  if (["PNG","JPG","JPEG","WEBP","GIF","SVG"].includes(ext)) return <ImageIcon size={22} />;
  if (["MP4","MOV","AVI","WEBM"].includes(ext)) return <Film size={22} />;
  if (["MP3","WAV","M4A"].includes(ext)) return <Music2 size={22} />;
  if (["ZIP","RAR","7Z","TAR","GZ"].includes(ext)) return <FileArchive size={22} />;
  return <FileText size={22} />;
}

export default function ItemCard({
  item,
  folder = false,
  canManage = true,
  onClick,
  onRename,
  onMove,
  onDelete,
  onDownload,
  onShare,
  onLink,
  onStar,
  starred = false,
}) {
  return (
    <div
      onDoubleClick={onClick}
      className="group bg-white border border-[#dedfd7] rounded-2xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="w-11 h-11 rounded-xl bg-[#f0f1e9] grid place-items-center">
          {iconFor(item.name, folder)}
        </div>
        <div className="flex items-center gap-1">
          {starred && (
            <span
              title="Starred"
              className="w-8 h-8 rounded-lg grid place-items-center text-[#8d9e37] bg-[#eff5ce]"
            >
              <Star size={15} fill="currentColor" />
            </span>
          )}
          <ItemMenu
          item={item}
          type={folder ? "folder" : "file"}
          canManage={canManage}
          onRename={onRename}
          onMove={onMove}
          onDelete={onDelete}
          onDownload={onDownload}
          onShare={onShare}
          onLink={onLink}
          onStar={onStar}
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="font-medium text-sm truncate" title={item.name}>
          {item.name}
        </div>
        <div className="text-xs text-black/40 mt-1">
          {folder ? "Folder" : formatBytes(Number(item.size_bytes ?? item.size ?? 0))}
        </div>
      </div>
    </div>
  );
}
