import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { X, UploadCloud } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import UploadModal from "./UploadModal";
import { useToast } from "./Toast";

export default function AppLayout() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { push } = useToast();

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1e201c] flex">
      <Sidebar onUpload={() => setUploadOpen(true)} />
      {mobile && (
        <div className="fixed inset-0 z-50 bg-[#20221e] text-white p-6 lg:hidden">
          <button className="absolute top-5 right-5" onClick={() => setMobile(false)}><X/></button>
          <div className="text-2xl font-semibold mb-10">Cloudroom</div>
          <div className="space-y-2">
            {[["/","Overview"],["/files","My files"],["/starred","Starred"],["/shared","Shared"],["/trash","Trash"],["/activity","Activity"],["/settings","Settings"]].map(([p,l]) =>
              <Link key={p} onClick={() => setMobile(false)} to={p} className="block p-3 rounded-xl hover:bg-white/10 capitalize">{l}</Link>
            )}
            <button onClick={() => {setMobile(false); setUploadOpen(true)}} className="mt-5 w-full p-3 rounded-xl bg-[#d9f36a] text-black flex justify-center gap-2"><UploadCloud size={18}/> Upload</button>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Topbar onMenu={() => setMobile(true)} onUpload={() => setUploadOpen(true)} />
        <main className="p-4 sm:p-7 lg:p-10 max-w-[1500px] mx-auto"><Outlet /></main>
      </div>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onDone={() => push("Upload completed")} />
    </div>
  );
}
