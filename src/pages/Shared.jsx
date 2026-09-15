import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Folder,
  Link2,
  UsersRound,
} from "lucide-react";
import { getSharedByMe, getSharedWithMe } from "../api/shares";
import { getLinks } from "../api/links";
import { downloadFile } from "../api/files";
import { formatBytes, formatDateTime, getErrorMessage } from "../lib/format";

function ItemIcon({ type }) {
  return (
    <div className="w-11 h-11 rounded-xl bg-[#f0f1e9] grid place-items-center shrink-0">
      {type === "folder" ? <Folder size={19} /> : <FileText size={19} />}
    </div>
  );
}

export default function Shared() {
  const [tab, setTab] = useState("with-me");
  const [items, setItems] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      if (tab === "links") {
        const r = await getLinks();
        setLinks(r.data.links || []);
      } else {
        const r = tab === "with-me" ? await getSharedWithMe() : await getSharedByMe();
        setItems(r.data.shares || []);
      }
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab]);

  async function download(id) {
    try {
      const r = await downloadFile(id);
      const url = r.data.downloadUrl || r.data.url || r.data.signedUrl;
      if (!url) throw new Error("Download URL was not returned.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  function copyLink(token) {
    const url = `${window.location.origin}/public/${token}`;
    navigator.clipboard?.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className="fade-in space-y-7">
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-black/35">Collaboration</div>
        <h1 className="font-display text-5xl mt-2">Shared</h1>
        <p className="text-sm text-black/40 mt-2">
          Everything you've shared, everything shared with you, and your public links.
        </p>
      </div>

      <div className="bg-white border border-[#dedfd7] rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1">
        <button onClick={() => setTab("with-me")} className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium ${tab === "with-me" ? "bg-[#20221e] text-white" : "text-black/45 hover:bg-black/5"}`}>
          Shared with me
        </button>
        <button onClick={() => setTab("by-me")} className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium ${tab === "by-me" ? "bg-[#20221e] text-white" : "text-black/45 hover:bg-black/5"}`}>
          Shared by me
        </button>
        <button onClick={() => setTab("links")} className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 ${tab === "links" ? "bg-[#20221e] text-white" : "text-black/45 hover:bg-black/5"}`}>
          <Link2 size={15} /> Public links
        </button>
      </div>

      {error && <div className="rounded-xl bg-red-50 text-red-700 p-4 text-sm">{error}</div>}

      <div className="bg-white border border-[#dedfd7] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)}</div>
        ) : tab === "links" ? (
          links.length ? (
            <div className="divide-y divide-[#ecece5]">
              {links.map(x => {
                const url = `${window.location.origin}/public/${x.token}`;
                return (
                  <div key={x.id} className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#eff5ce] grid place-items-center shrink-0"><Link2 size={18}/></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm capitalize">{x.resource_type} public link</div>
                      <div className="text-xs text-black/40 mt-1 truncate">{url}</div>
                      <div className="text-xs text-black/35 mt-1">{x.expires_at ? `Expires ${formatDateTime(x.expires_at)}` : "No expiration"}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => window.open(url, "_blank", "noopener,noreferrer")} className="px-3 py-2 rounded-xl border border-[#d6d7cf] text-xs inline-flex items-center gap-1.5"><ExternalLink size={14}/> Open</button>
                      <button onClick={() => copyLink(x.token)} className="px-3 py-2 rounded-xl bg-[#20221e] text-white text-xs inline-flex items-center gap-1.5">{copied === x.token ? <Check size={14}/> : <Copy size={14}/>} {copied === x.token ? "Copied" : "Copy"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty icon={<Link2 size={25}/>} title="No public links" text="Create a public link from a file or folder's Share menu." />
          )
        ) : (
          items.length ? (
            <div className="divide-y divide-[#ecece5]">
              {items.map(x => (
                <div key={x.share_id} className="p-4 flex items-center gap-4">
                  <ItemIcon type={x.resource_type} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{x.name}</div>
                    {tab === "with-me" ? (
                      <div className="text-xs text-black/40 mt-1">
                        {x.role} · from {x.owner_name || x.owner_email} · {x.resource_type === "file" ? formatBytes(x.size_bytes) : "Folder"} · {formatDateTime(x.shared_at)}
                      </div>
                    ) : (
                      <div className="text-xs text-black/40 mt-1">
                        {x.role} · shared with {x.shared_with_name || x.shared_with_email} · {x.shared_with_email} · {formatDateTime(x.shared_at)}
                      </div>
                    )}
                  </div>
                  {x.resource_type === "folder" ? (
                    <button onClick={() => window.location.href = `/files/${x.resource_id}`} className="p-2 rounded-lg hover:bg-black/5"><ArrowUpRight size={17}/></button>
                  ) : (
                    <button onClick={() => download(x.resource_id)} className="p-2 rounded-lg hover:bg-black/5"><ArrowUpRight size={17}/></button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty icon={<UsersRound size={25}/>} title={tab === "with-me" ? "Nothing shared with you" : "You haven't shared anything"} text={tab === "with-me" ? "Files and folders shared with your account will appear here." : "Share a file or folder from its three-dot menu to see it here."} />
          )
        )}
      </div>
    </div>
  );
}

function Empty({ icon, title, text }) {
  return <div className="p-16 text-center text-black/35"><div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-[#f5f5f0] grid place-items-center">{icon}</div><div className="text-sm font-semibold text-black/55">{title}</div><div className="text-sm mt-1">{text}</div></div>;
}
