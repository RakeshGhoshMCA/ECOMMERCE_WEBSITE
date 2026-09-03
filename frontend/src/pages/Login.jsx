import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveTokens } from "../utils/auth";

function Login() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/token/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        saveTokens(data);
        nav("/");
      } else {
        setMsg(data.detail || "Invalid credentials");
      }
    } catch(err) {
      console.error(err);
      setMsg("Unable to sign in. Please try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-violet-100 ring-1 ring-slate-100 md:p-9">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-900"><span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-600 text-sm text-white">V</span> Velora</Link><p className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-violet-600">Welcome back</p><h1 className="mt-2 text-3xl font-black">Sign in to your account</h1><p className="mt-3 text-slate-500">Access your orders and saved delivery details.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <input name="username" onChange={handleChange} value={form.username} placeholder="Username" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"/>
          <input name="password" type="password" onChange={handleChange} value={form.password} placeholder="Password" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"/>
          <button disabled={submitting} className="w-full rounded-full bg-violet-600 py-3 font-bold text-white transition hover:bg-violet-700 disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {msg && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{msg}</p>}
        <p className="mt-6 text-center text-sm text-slate-600">New to Velora? <Link to="/signup" className="font-bold text-violet-700">Create an account</Link></p>
      </div>
    </main>
  );
}

export default Login;
