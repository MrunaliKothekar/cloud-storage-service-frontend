import { useEffect, useState } from "react";
import { FolderPlus, LayoutGrid, List, Plus, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getFolder, createFolder, updateFolder, deleteFolder } from "../api/folders";
import { getFiles, updateFile, deleteFile, downloadFile } from "../api/files";
import { formatBytes, getErrorMessage } from "../lib/format";
import Breadcrumbs from "../components/Breadcrumbs";
import ItemCard from "../components/ItemCard";
import UploadModal from "../components/UploadModal";
import CreateFolderModal from "../components/CreateFolderModal";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";

export default function Files(){
  const {id}=useParams(); const nav=useNavigate(); const {push}=useToast();
  const [data,setData]=useState({folder:null,children:{folders:[],files:[]},path:[]}); const [rootFiles,setRootFiles]=useState([]);
  const [loading,setLoading]=useState(true),[upload,setUpload]=useState(false),[newFolder,setNewFolder]=useState(false),[rename,setRename]=useState(null),[name,setName]=useState("");
  const [view,setView]=useState("grid");
  async function load(){setLoading(true);try{if(id){const r=await getFolder(id);setData(r.data)}else{const r=await getFiles();setRootFiles(r.data.files||r.data||[]);setData({folder:null,children:{folders:[],files:r.data.files||r.data||[]},path:[]})}}finally{setLoading(false)}}
  useEffect(()=>{load()},[id]);
  const folders=data.children?.folders||[]; const files=data.children?.files||rootFiles;
  async function renameItem(){try{if(rename.type==="folder")await updateFolder(rename.id,{name});else await updateFile(rename.id,{name});push("Renamed successfully");setRename(null);load()}catch(e){alert(getErrorMessage(e))}}
  async function remove(item,type){if(!confirm(`Move "${item.name}" to trash?`))return;try{if(type==="folder")await deleteFolder(item.id);else await deleteFile(item.id);push("Moved to trash");load()}catch(e){alert(getErrorMessage(e))}}
  async function download(id){try{const r=await downloadFile(id);window.open(r.data.url || r.data.signedUrl,"_blank")}catch(e){alert(getErrorMessage(e))}}
  return <div className="fade-in space-y-7">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div><Breadcrumbs path={data.path}/><h1 className="font-display text-5xl mt-3">{data.folder?.name || "My files"}</h1><p className="text-sm text-black/40 mt-1">{folders.length} folders · {files.length} files</p></div>
      <div className="flex gap-2"><button onClick={()=>setNewFolder(true)} className="h-11 px-4 rounded-xl border border-[#d6d7cf] bg-white flex gap-2 items-center text-sm"><FolderPlus size={17}/> New folder</button><button onClick={()=>setUpload(true)} className="h-11 px-4 rounded-xl bg-[#20221e] text-white flex gap-2 items-center text-sm"><UploadCloud size={17}/> Upload</button></div>
    </div>
    <div className="flex items-center justify-between border-b border-[#dedfd7] pb-3"><div className="text-xs uppercase tracking-wider text-black/35">Contents</div><div className="flex bg-white border border-[#dedfd7] rounded-lg p-1"><button onClick={()=>setView("grid")} className={`p-1.5 rounded ${view==="grid"?"bg-black/5":""}`}><LayoutGrid size={16}/></button><button onClick={()=>setView("list")} className={`p-1.5 rounded ${view==="list"?"bg-black/5":""}`}><List size={16}/></button></div></div>
    {loading?<div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{[1,2,3,4,5,6].map(i=><div key={i} className="h-36 rounded-2xl skeleton"/>)}</div>:
    !folders.length&&!files.length?<div className="py-24 text-center"><div className="font-display text-4xl">Nothing here yet.</div><p className="text-sm text-black/40 mt-2">Create a folder or upload your first file.</p></div>:
    <div className={view==="grid"?"grid sm:grid-cols-2 xl:grid-cols-4 gap-4":"space-y-2"}>
      {folders.map(f=><ItemCard key={f.id} item={f} folder onClick={()=>nav(`/files/${f.id}`)} onMenu={()=>{setRename({id:f.id,type:"folder"});setName(f.name)}}/>)}
      {files.map(f=><ItemCard key={f.id} item={f} onMenu={()=>{setRename({id:f.id,type:"file"});setName(f.name)}} onClick={()=>download(f.id)}/>)}
    </div>}
    <UploadModal open={upload} onClose={()=>setUpload(false)} folderId={id||null} onDone={()=>{push("Upload completed");load()}}/>
    <CreateFolderModal open={newFolder} onClose={()=>setNewFolder(false)} parentId={id||null} onDone={()=>{push("Folder created");load()}}/>
    <Modal open={!!rename} onClose={()=>setRename(null)} title={`Rename ${rename?.type || ""}`}>
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full h-12 rounded-xl border border-[#d6d7cf] px-4 bg-white outline-none"/>
      <button onClick={renameItem} className="w-full h-12 rounded-xl bg-[#20221e] text-white mt-4">Save changes</button>
    </Modal>
  </div>
}
