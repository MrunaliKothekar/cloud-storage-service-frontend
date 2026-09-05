import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] p-4 grid place-items-center" onMouseDown={onClose}>
      <div className={`w-full ${width} bg-[#fbfbf7] rounded-[28px] border border-[#d9dad2] shadow-2xl overflow-hidden`} onMouseDown={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-[#e0e1d9] flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full hover:bg-black/5"><X size={18}/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
