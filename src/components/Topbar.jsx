import { Bell, Menu, Search } from "lucide-react";
import { initials } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenu, onUpload }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-[76px] px-4 sm:px-7 lg:px-10 flex items-center gap-4 border-b border-[#dedfd7] bg-[#f5f5f0]/90 backdrop-blur sticky top-0 z-30">
      <button className="lg:hidden w-10 h-10 rounded-xl border border-[#d8d9d0] grid place-items-center" onClick={onMenu}><Menu size={19}/></button>
      <button onClick={() => navigate("/search")} className="hidden sm:flex flex-1 max-w-xl items-center gap-3 bg-white border border-[#dddeda] rounded-xl h-11 px-4 text-sm text-black/40 hover:border-black/20">
        <Search size={18}/> Search files, folders and shared items...
        <span className="ml-auto font-mono text-[10px] bg-[#f0f0ea] px-2 py-1 rounded">⌘ K</span>
      </button>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={onUpload} className="sm:hidden w-10 h-10 rounded-xl bg-[#d9f36a] grid place-items-center"><Search size={18}/></button>
        <button className="w-10 h-10 rounded-xl hover:bg-black/5 grid place-items-center"><Bell size={18}/></button>
        <div className="w-9 h-9 rounded-full bg-[#292b27] text-white grid place-items-center text-xs font-semibold">{initials(user?.name || user?.email || "U")}</div>
      </div>
    </header>
  );
}
