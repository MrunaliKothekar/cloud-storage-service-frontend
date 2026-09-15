import { useEffect, useState } from "react";
import Modal from "./Modal";
import { createLink, deleteLink, getLinks } from "../api/links";
import { getErrorMessage, formatDateTime } from "../lib/format";

export default function LinkModal({ open, onClose, item, type }) {
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [link, setLink] = useState("");
  const [links, setLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadLinks() {
    if (!item) return;
    try {
      const r = await getLinks(type, item.id);
      setLinks(r.data.links || []);
    } catch (e) { setError(getErrorMessage(e)); }
  }

  useEffect(() => {
    if (open) {
      setPassword(""); setExpiresAt(""); setLink(""); setError("");
      loadLinks();
    }
  }, [open, item?.id, type]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = { resourceType: type, resourceId: item.id };
      if (password) payload.password = password;
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();
      const r = await createLink(payload);
      const token = r.data.link.token;
      setLink(`${window.location.origin}/public/${token}`);
      await loadLinks();
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSaving(false); }
  }

  async function revoke(id) {
    try { await deleteLink(id); await loadLinks(); }
    catch (e) { setError(getErrorMessage(e)); }
  }

  function makeUrl(token) {
    return `${window.location.origin}/public/${token}`;
  }

  return (
    <Modal open={open} onClose={onClose} title="Public links">
      <div className="space-y-5">
        <form onSubmit={submit} className="space-y-3">
          <input type="password" minLength={4} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password (optional)" className="auth-input" />
          <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
            className="auth-input" />
          {error && <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
          <button disabled={saving} className="auth-btn">{saving ? "Creating..." : "Create new link"}</button>
        </form>

        {link && (
          <div className="rounded-xl bg-[#eff5ce] p-3">
            <div className="text-xs font-semibold mb-2">New link</div>
            <div className="flex gap-2">
              <input readOnly value={link} className="auth-input flex-1 text-xs" onFocus={e => e.target.select()} />
              <button type="button" className="px-3 rounded-xl bg-[#20221e] text-white text-xs"
                onClick={() => navigator.clipboard?.writeText(link)}>Copy</button>
            </div>
          </div>
        )}

        <div>
          <div className="text-xs uppercase tracking-wider text-black/40 mb-2">Active links</div>
          {links.length ? (
            <div className="space-y-2 max-h-48 overflow-auto">
              {links.map(x => (
                <div key={x.id} className="p-3 rounded-xl bg-[#f5f5f0]">
                  <div className="flex items-center gap-2">
                    <input readOnly value={makeUrl(x.token)} className="auth-input text-xs flex-1" />
                    <button type="button" onClick={() => navigator.clipboard?.writeText(makeUrl(x.token))}
                      className="text-xs font-semibold">Copy</button>
                    <button type="button" onClick={() => revoke(x.id)} className="text-xs text-red-600">Revoke</button>
                  </div>
                  <div className="text-xs text-black/40 mt-2">
                    {x.expires_at ? `Expires ${formatDateTime(x.expires_at)}` : "No expiration"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-black/35">No active public links.</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
