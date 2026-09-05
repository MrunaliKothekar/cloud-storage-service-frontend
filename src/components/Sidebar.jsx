import { NavLink } from "react-router-dom";
import {
  Activity, Clock3, Files, FolderOpen, Home, Link2, LogOut,
  Search, Settings, Star, Trash2, UploadCloud, UsersRound
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  ["/", Home, "Overview"],
  ["/files", FolderOpen, "My files"],
  ["/starred", Star, "Starred"],
  ["/shared", UsersRound, "Shared"],
  ["/trash", Trash2, "Trash"],
  ["/activity", Activity, "Activity"],
  ["/settings", Settings, "Settings"],
];

export default function Sidebar({ onUpload }) {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-[250px] shrink-0 bg-[#20221e] text-[#f4f4ed] min-h-screen flex-col sticky top-0 h-screen">
      <div className="px-7 pt-7">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#d9f36a] text-[#20221e] rounded-xl grid place-items-center font-black">C</div>
          <div>
            <div className="font-semibold tracking-tight">Cloudroom</div>
            <div className="text-[10px] uppercase tracking-[.2em] text-white/40">Private storage</div>
          </div>
        </div>
      </div>

      <nav className="px-4 mt-10 space-y-1">
        {links.map(([to, Icon, label]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
              isActive ? "bg-white/10 text-white" : "text-white/55 hover:text-white hover:bg-white/5"
            }`}>
            <Icon size={18} strokeWidth={1.8}/>{label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-7 px-5">
        <button onClick={onUpload} className="w-full bg-[#d9f36a] text-[#20221e] rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:translate-y-[-1px] transition">
          <UploadCloud size={18}/> Upload files
        </button>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-[.16em] text-white/35 mb-2">Signed in as</div>
          <div className="text-sm truncate">{user?.name || user?.email}</div>
          <div className="text-xs text-white/40 truncate mt-1">{user?.email}</div>
          <button onClick={logout} className="mt-4 text-xs text-white/50 hover:text-white flex items-center gap-2"><LogOut size={14}/> Sign out</button>
        </div>
      </div>
    </aside>
  );
}
