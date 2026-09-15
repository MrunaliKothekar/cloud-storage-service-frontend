import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { accessPublicLink } from "../api/links";
import { formatBytes } from "../lib/format";

export default function PublicLink() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [error, setError] = useState("");

  async function load(p = "") {
    try {
      setError("");
      const r = await accessPublicLink(token, p);
      setData(r.data);
      setPasswordRequired(false);
    } catch (e) {
      setData(null);
      setPasswordRequired(Boolean(e.response?.data?.passwordRequired));
      setError(e.response?.data?.message || "This link is unavailable.");
    }
  }

  useEffect(() => { load(); }, [token]);

  return (
    <div className="min-h-screen bg-[#f5f5f0] grid place-items-center p-6">
      <div className="w-full max-w-lg bg-white border border-[#dedfd7] rounded-[28px] p-7 shadow-xl">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-[#20221e] text-[#d9f36a] rounded-xl grid place-items-center font-black">C</div>
          <b>Cloudroom</b>
        </div>

        {error && (
          <div className="mt-8">
            <div className="font-display text-3xl">
              {passwordRequired ? "Protected link" : "Link unavailable"}
            </div>
            <p className="text-sm text-black/45 mt-2">{error}</p>
            {passwordRequired && (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && load(password)}
                  placeholder="Password"
                  className="auth-input mt-5"
                />
                <button onClick={() => load(password)} className="auth-btn mt-3">Unlock</button>
              </>
            )}
          </div>
        )}

        {data && !error && (
          <div className="mt-8">
            <div className="font-display text-3xl">
              {data.file?.name || data.folder?.name || "Shared resource"}
            </div>

            {data.type === "file" ? (
              <>
                <p className="text-sm text-black/45 mt-2">
                  {data.file?.mimeType || "File"} · {formatBytes(data.file?.sizeBytes)}
                </p>
                <a
                  href={data.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="auth-btn mt-6"
                >
                  Download file
                </a>
              </>
            ) : (
              <div className="mt-5 space-y-2">
                {(data.children || []).map(x => (
                  <div key={`${x.resource_type}-${x.id}`} className="p-3 rounded-xl bg-[#f5f5f0] text-sm flex items-center justify-between">
                    <span>{x.name}</span>
                    <span className="text-xs text-black/40">{x.resource_type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
