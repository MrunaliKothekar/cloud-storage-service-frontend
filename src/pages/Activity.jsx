import { useEffect, useState } from "react";
import { Activity as ActivityIcon } from "lucide-react";
import { getActivities } from "../api/activities";
import { formatDateTime } from "../lib/format";

function activityLabel(x) {
  let context = x.context;
  if (typeof context === "string") {
    try { context = JSON.parse(context); } catch { context = {}; }
  }
  if (x.action === "rename" && context?.action === "create") return "created";
  if (x.action === "share" && context?.type === "public_link_created") return "created public link for";
  return x.action;
}

export default function Activity() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getActivities()
      .then(r => setItems(r.data.activities || []))
      .catch(e => setError(e.response?.data?.message || "Could not load activity"));
  }, []);

  return (
    <div className="fade-in space-y-7">
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-black/35">Timeline</div>
        <h1 className="font-display text-5xl mt-2">Activity</h1>
      </div>
      {error && <div className="rounded-xl bg-red-50 text-red-700 p-4 text-sm">{error}</div>}
      <div className="bg-white border border-[#dedfd7] rounded-2xl overflow-hidden">
        {items.length ? items.map(x => (
          <div key={x.id} className="p-4 flex items-center gap-4 border-b last:border-0">
            <div className="w-10 h-10 rounded-full bg-[#eff5ce] grid place-items-center"><ActivityIcon size={17}/></div>
            <div className="flex-1">
              <div className="text-sm"><b>{activityLabel(x)}</b> · {x.resource_type}</div>
              <div className="text-xs text-black/40 mt-1">{formatDateTime(x.created_at)}</div>
            </div>
          </div>
        )) : (
          <div className="p-14 text-center text-black/35">No activity yet.</div>
        )}
      </div>
    </div>
  );
}
