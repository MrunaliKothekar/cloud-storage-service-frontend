import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Cloud, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { googleLoginUrl } from "../api/auth";
import { getErrorMessage } from "../lib/format";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({email:"", password:""});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { await login(form); nav(loc.state?.from || "/", {replace:true}); }
    catch(e) { setError(getErrorMessage(e)); }
    finally { setBusy(false); }
  }

  return <AuthShell>
    <div className="mb-9">
      <div className="text-xs uppercase tracking-[.2em] text-black/40 mb-3">Welcome back</div>
      <h1 className="font-display text-5xl leading-none">Your files,<br/><i>your room.</i></h1>
      <p className="text-black/50 mt-4">Private storage designed to stay out of your way.</p>
    </div>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email"><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="auth-input" placeholder="you@example.com"/></Field>
      <Field label="Password"><div className="relative"><input type={show?"text":"password"} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="auth-input pr-12" placeholder="••••••••"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-3 text-black/40">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></Field>
      {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
      <button disabled={busy} className="auth-btn">{busy?"Signing in...":"Sign in"}<ArrowRight size={18}/></button>
    </form>
    <div className="my-5 flex items-center gap-3 text-xs text-black/35"><span className="h-px bg-black/10 flex-1"/>OR<span className="h-px bg-black/10 flex-1"/></div>
    <a href={googleLoginUrl()} className="auth-google">Continue with Google</a>
    <p className="text-sm text-black/50 mt-7 text-center">New here? <Link className="text-black font-semibold" to="/register">Create an account</Link></p>
  </AuthShell>;
}

function Field({label,children}) { return <label className="block"><span className="text-xs font-medium text-black/50">{label}</span><div className="mt-1.5">{children}</div></label>; }
function AuthShell({children}) { return <div className="min-h-screen bg-[#f5f5f0] grid lg:grid-cols-2">
  <div className="hidden lg:flex paper-grid bg-[#20221e] text-white p-12 relative overflow-hidden">
    <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-[#d9f36a] blur-3xl opacity-20"/>
    <div className="relative flex flex-col justify-between w-full"><div className="flex gap-3 items-center"><div className="w-9 h-9 rounded-xl bg-[#d9f36a] text-black grid place-items-center font-black">C</div><b>Cloudroom</b></div><div><div className="font-display text-6xl leading-[.95] max-w-lg">A quieter place<br/>for the things<br/><i>you keep.</i></div><p className="text-white/45 mt-6 max-w-md">Files, folders, sharing and public links — without turning storage into a maze.</p></div><div className="text-xs text-white/30">PRIVATE CLOUD STORAGE · 2026</div></div>
  </div>
  <div className="p-6 sm:p-12 lg:p-20 flex items-center justify-center"><div className="w-full max-w-md">{children}</div></div>
</div>; }
