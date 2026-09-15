import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Link2, Mail, Shield, UserPlus } from "lucide-react";
import Modal from "./Modal";
import { createShare, deleteShare, getShares } from "../api/shares";
import { createLink, deleteLink, getLinks } from "../api/links";
import { getErrorMessage, formatDateTime } from "../lib/format";

export default function ShareModal({ open, onClose, item, type, onDone }) {
  const [tab, setTab] = useState("people");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [shares, setShares] = useState([]);
  const [links, setLinks] = useState([]);
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [newLink, setNewLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  const resourceLabel = type === "folder" ? "folder" : "file";

  async function load() {
    if (!item) return;
    try {
      const [shareResponse, linkResponse] = await Promise.all([
        getShares(type, item.id),
        getLinks(type, item.id),
      ]);
      setShares(shareResponse.data.shares || []);
      setLinks(linkResponse.data.links || []);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  useEffect(() => {
    if (open) {
      setTab("people");
      setEmail("");
      setRole("viewer");
      setPassword("");
      setExpiresAt("");
      setNewLink("");
      setError("");
      setCopied(false);
      load();
    }
  }, [open, item?.id, type]);

  async function submit(e) {
    e.preventDefault();
    if (!item || !email.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createShare({
        resourceType: type,
        resourceId: item.id,
        sharedWithEmail: email.trim(),
        role,
      });
      const recipient = email.trim();
      setEmail("");
      await load();
      onDone?.();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function revokeShare(id) {
    try {
      await deleteShare(id);
      await load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  async function makeLink(e) {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    setError("");
    try {
      const payload = { resourceType: type, resourceId: item.id };
      if (password) payload.password = password;
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();
      const r = await createLink(payload);
      const token = r.data.link.token;
      setNewLink(`${window.location.origin}/public/${token}`);
      await load();
      requestAnimationFrame(() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function revokeLink(id) {
    try {
      await deleteLink(id);
      if (newLink) setNewLink("");
      await load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  function copy(text) {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    requestAnimationFrame(() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
    setTimeout(() => setCopied(false), 1400);
  }

  function openGmail(recipient = "", alreadyShared = false) {
    const subject = `Shared with you: ${item?.name || "a file"}`;
    const access = alreadyShared
      ? `You now have ${role} access to this ${resourceLabel} in Cloudroom.`
      : `I'd like to share this ${resourceLabel} with you on Cloudroom.`;
    const body = `${access}\n\nOpen Cloudroom: ${window.location.origin}/files\n\nIf you don't have an account yet, register with this Gmail address to access the shared resource.`;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const activeLinks = useMemo(() => links || [], [links]);

  return (
    <Modal open={open} onClose={onClose} title={`Share ${item?.name || ""}`} width="max-w-2xl">
      <div ref={contentRef} className="space-y-5 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1 scroll-smooth">
        <div className="flex rounded-2xl bg-[#f1f2eb] p-1.5 sticky top-0 z-10">
          <button type="button" onClick={() => { setTab("people"); contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${tab === "people" ? "bg-white shadow-sm" : "text-black/45"}`}>
            People
          </button>
          <button type="button" onClick={() => { setTab("link"); contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${tab === "link" ? "bg-white shadow-sm" : "text-black/45"}`}>
            General access
          </button>
        </div>

        {error && <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        {tab === "people" ? (
          <>
            <div className="rounded-2xl border border-[#dedfd7] p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus size={17} />
                <div>
                  <div className="text-sm font-semibold">Share with people</div>
                  <div className="text-xs text-black/40">Use their Google/Gmail account email.</div>
                </div>
              </div>
              <form onSubmit={submit} className="space-y-3">
                <div className="flex gap-2">
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@gmail.com" className="auth-input flex-1" />
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-28 rounded-xl border border-[#d6d7cf] px-2 bg-white text-sm">
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button disabled={saving} className="auth-btn flex-1 inline-flex items-center justify-center gap-2"><Mail size={16}/>{saving ? "Sharing..." : "Share"}</button>
                  {email && <button type="button" onClick={() => openGmail(email)} className="px-4 rounded-xl border border-[#d6d7cf] text-sm">Gmail</button>}
                </div>
              </form>
              <div className="flex gap-2 mt-3 text-xs text-black/45"><Shield size={14}/> Viewer can open/download. Editor can make allowed changes.</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-black/40 mb-2">People with access</div>
              {shares.length ? <div className="space-y-2 max-h-48 overflow-auto">{shares.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f5f0]">
                  <div className="w-9 h-9 rounded-full bg-[#d9f36a] grid place-items-center text-xs font-bold">{(s.user_name || s.user_email || "?").slice(0,1).toUpperCase()}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm truncate">{s.user_name || s.user_email}</div><div className="text-xs text-black/40">{s.user_email} · {s.role}</div></div>
                  <button type="button" onClick={() => revokeShare(s.id)} className="text-xs text-red-600">Revoke</button>
                </div>
              ))}</div> : <div className="text-sm text-black/35">Not shared with anyone yet.</div>}
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-[#dedfd7] p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eff5ce] grid place-items-center"><Link2 size={18}/></div>
                <div><div className="font-semibold text-sm">Anyone with the link</div><div className="text-xs text-black/40">Anyone who has this link can open the resource. You can add a password or expiration.</div></div>
              </div>
              <form onSubmit={makeLink} className="mt-4 space-y-3">
                <input type="password" minLength={4} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (optional)" className="auth-input" />
                <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="auth-input" />
                <button disabled={saving} className="auth-btn">{saving ? "Creating..." : "Create public link"}</button>
              </form>
            </div>
            {newLink && <div className="rounded-xl bg-[#eff5ce] p-3"><div className="text-xs font-semibold mb-2">New public link</div><div className="flex gap-2"><input readOnly value={newLink} className="auth-input flex-1 text-xs"/><button type="button" onClick={() => copy(newLink)} className="px-3 rounded-xl bg-[#20221e] text-white text-xs inline-flex items-center gap-1">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy"}</button></div></div>}
            <div><div className="text-xs uppercase tracking-wider text-black/40 mb-2">Active links</div>{activeLinks.length ? <div className="space-y-3">{activeLinks.map(x => { const url = `${window.location.origin}/public/${x.token}`; return <div key={x.id} className="p-4 rounded-2xl border border-[#dedfd7] bg-[#f7f7f2]"><input readOnly value={url} className="auth-input text-xs w-full"/><div className="flex items-center justify-between gap-2 mt-3"><div className="text-xs text-black/40">{x.expires_at ? `Expires ${formatDateTime(x.expires_at)}` : "No expiration"}</div><div className="flex items-center gap-3"><button type="button" onClick={() => window.open(url, "_blank", "noopener,noreferrer")} className="text-xs font-semibold">Open</button><button type="button" onClick={() => copy(url)} className="text-xs font-semibold">Copy</button><button type="button" onClick={() => revokeLink(x.id)} className="text-xs font-semibold text-red-600">Revoke</button></div></div></div>})}</div> : <div className="text-sm text-black/35">No active public links.</div>}</div>
          </>
        )}
      </div>
    </Modal>
  );
}
