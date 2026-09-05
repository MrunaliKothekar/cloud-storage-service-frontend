import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/format";

export default function Register() {
  const { register } = useAuth(); const nav = useNavigate();
  const [form,setForm]=useState({name:"",email:"",password:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);setError("");try{await register(form);nav("/")}catch(e){setError(getErrorMessage(e))}finally{setBusy(false)}}
  return <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center p-6 paper-grid">
    <div className="w-full max-w-md bg-white border border-[#dedfd7] rounded-[30px] p-7 sm:p-10 shadow-xl">
      <div className="flex items-center gap-3 mb-9"><div className="w-10 h-10 rounded-xl bg-[#20221e] text-[#d9f36a] grid place-items-center font-black">C</div><b>Cloudroom</b></div>
      <div className="text-xs uppercase tracking-[.2em] text-black/40">Start fresh</div><h1 className="font-display text-4xl mt-2">Make some room.</h1><p className="text-sm text-black/45 mt-2 mb-7">Create your private storage space.</p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name"><input required className="auth-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></Field>
        <Field label="Email"><input required type="email" className="auth-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></Field>
        <Field label="Password"><input required minLength={6} type="password" className="auth-input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters"/></Field>
        {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
        <button disabled={busy} className="auth-btn">{busy?"Creating...":"Create account"}<ArrowRight size={18}/></button>
      </form>
      <p className="text-sm text-black/50 mt-7 text-center">Already have an account? <Link className="font-semibold text-black" to="/login">Sign in</Link></p>
    </div>
  </div>;
}
function Field({label,children}){return <label className="block"><span className="text-xs text-black/50">{label}</span><div className="mt-1.5">{children}</div></label>}
