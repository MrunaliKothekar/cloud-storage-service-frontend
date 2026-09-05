import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ path = [] }) {
  return <div className="flex items-center gap-1.5 text-sm overflow-x-auto">
    <Link to="/files" className="shrink-0 text-black/45 hover:text-black flex items-center gap-1"><Home size={15}/></Link>
    {path.map((p, i) => <span key={p.id} className="flex items-center gap-1.5 shrink-0">
      <ChevronRight size={14} className="text-black/25"/>
      {i === path.length - 1 ? <span className="font-medium">{p.name}</span> : <Link className="text-black/45 hover:text-black" to={`/files/${p.id}`}>{p.name}</Link>}
    </span>)}
  </div>;
}
