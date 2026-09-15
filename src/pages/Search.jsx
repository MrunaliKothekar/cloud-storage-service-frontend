import { useEffect, useState } from "react";
import { Search as SearchIcon, Folder, FileText, ArrowUpRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { searchAll } from "../api/search";
import { formatBytes } from "../lib/format";

export default function Search(){
  const [params,setParams]=useSearchParams(); const [q,setQ]=useState(params.get("q")||""); const [data,setData]=useState({folders:[],files:[]}); const [loading,setLoading]=useState(false);
  useEffect(()=>{
    const query=params.get("q");
    if(!query){ setData({folders:[],files:[]}); return; }
    setLoading(true);
    searchAll(query)
      .then(r=>{
        const results=r.data.results || [];
        setData({
          folders: results.filter(x=>x.resource_type==="folder"),
          files: results.filter(x=>x.resource_type==="file"),
        });
      })
      .catch(()=>setData({folders:[],files:[]}))
      .finally(()=>setLoading(false));
  },[params]);
  function submit(e){e.preventDefault();setParams(q?{q}:{});}
  return <div className="fade-in space-y-8"><div><div className="text-xs uppercase tracking-[.2em] text-black/35">Find anything</div><h1 className="font-display text-5xl mt-2">Search</h1></div>
    <form onSubmit={submit} className="max-w-2xl flex bg-white border border-[#d7d8d0] rounded-2xl overflow-hidden"><SearchIcon className="m-4 text-black/35" size={20}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name..." className="flex-1 outline-none"/><button className="px-5 bg-[#20221e] text-white m-1.5 rounded-xl text-sm">Search</button></form>
    {loading?<div className="text-sm text-black/40">Searching...</div>:params.get("q")&&<div className="space-y-8"><Section title="Folders" items={data.folders||[]} folder/><Section title="Files" items={data.files||[]}/></div>}
  </div>
}
function Section({title,items,folder}){return <section><div className="text-xs uppercase tracking-wider text-black/35 mb-3">{title} · {items.length}</div>{items.length?<div className="bg-white border border-[#dedfd7] rounded-2xl overflow-hidden">{items.map(x=><Link key={x.id} to={folder?`/files/${x.id}`:(x.folder_id?`/files/${x.folder_id}`:"/files")} className="flex items-center gap-4 p-4 border-b last:border-0 border-[#eee] hover:bg-black/[.02]"><div className="w-10 h-10 rounded-xl bg-[#f0f1e9] grid place-items-center">{folder?<Folder size={18}/>:<FileText size={18}/>}</div><div className="flex-1"><div className="font-medium text-sm">{x.name}</div><div className="text-xs text-black/40">{folder?"Folder":formatBytes(x.size_bytes ?? x.size)}</div></div><ArrowUpRight size={16}/></Link>)}</div>:<div className="text-sm text-black/35">No matches.</div>}</section>}
