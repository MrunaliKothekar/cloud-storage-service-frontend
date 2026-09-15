import { useEffect, useState } from "react";
import { ArrowUpRight, Files, Folder, HardDrive, Plus, Sparkles, Star, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getFileStats } from "../api/files";
import { getRootContents } from "../api/folders";
import { getStars } from "../api/stars";
import { formatBytes, formatDate } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export default function Dashboard(){
  const {user}=useAuth(); const [data,setData]=useState({files:[],folders:[],totalFiles:0,totalFolders:0,storageBytes:0}); const [stars,setStars]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{
  Promise.all([getRootContents(), getStars(), getFileStats()])
    .then(([contents, s, stats])=>{
      const c=contents.data;
      const files=c.children?.files||[];
      const folders=c.children?.folders||[];
      const st = stats.data || {};
      setData({files,folders,totalFiles:Number(st.files || 0),totalFolders:Number(st.folders || 0),storageBytes:Number(st.storageBytes || 0)});
      setStars(s.data.stars||[]);
    })
    .catch(()=>{})
    .finally(()=>setLoading(false));
},[]);
  const recent=data.files.slice(0,5);
  return <div className="fade-in space-y-8">
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-5">
      <div><div className="text-xs uppercase tracking-[.2em] text-black/35">Workspace / overview</div><h1 className="font-display text-5xl mt-2">Good to see you,<br/><i>{user?.name?.split(" ")[0] || "there"}.</i></h1></div>
      <Link to="/files" className="inline-flex items-center gap-2 bg-[#20221e] text-white px-5 py-3 rounded-xl text-sm">Open files <ArrowUpRight size={16}/></Link>
    </section>
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Stat icon={Files} label="Files" value={data.totalFiles}/>
      <Stat icon={Folder} label="Folders" value={data.totalFolders}/>
      <Stat icon={Star} label="Starred" value={stars.length}/>
      <Stat icon={HardDrive} label="Storage" value={formatBytes(data.storageBytes)}/>
    </div>
    <div className="grid xl:grid-cols-[1fr_330px] gap-5">
      <section className="bg-white border border-[#dedfd7] rounded-[24px] overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-[#e1e2da]"><div><h2 className="font-semibold">Recent files</h2><p className="text-xs text-black/40 mt-1">Your latest uploads</p></div><Link to="/files" className="text-sm font-medium">View all</Link></div>
        {loading?<div className="p-5 space-y-3">{[1,2,3,4].map(i=><div className="h-12 rounded-xl skeleton" key={i}/>)}</div>:recent.length?<div>{recent.map(f=><Link to={f.folder_id ? `/files/${f.folder_id}` : "/files"} key={f.id} className="flex items-center gap-4 p-4 hover:bg-black/[.02] border-b border-[#eee] last:border-0"><div className="w-10 h-10 rounded-xl bg-[#f0f1e9] grid place-items-center"><Files size={18}/></div><div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{f.name}</div><div className="text-xs text-black/40">{formatBytes(f.size_bytes ?? f.size)} · {formatDate(f.updated_at || f.created_at)}</div></div><ArrowUpRight size={16} className="text-black/25"/></Link>)}</div>:<div className="p-10 text-center text-sm text-black/40">No files yet.</div>}
      </section>
      <section className="bg-[#d9f36a] rounded-[24px] p-6 min-h-[250px] flex flex-col justify-between"><div><Sparkles size={22}/><div className="font-display text-3xl mt-5">Keep it simple.</div><p className="text-sm mt-2 max-w-xs text-black/60">Organize files into folders, share selectively, and keep your workspace calm.</p></div><Link to="/files" className="font-semibold text-sm flex items-center gap-2">Go to your room <ArrowUpRight size={15}/></Link></section>
    </div>
  </div>
}
function Stat({icon:Icon,label,value}){return <div className="bg-white border border-[#dedfd7] rounded-2xl p-5"><Icon size={18} className="text-black/45"/><div className="text-2xl font-semibold mt-5">{value}</div><div className="text-xs uppercase tracking-wider text-black/40 mt-1">{label}</div></div>}
