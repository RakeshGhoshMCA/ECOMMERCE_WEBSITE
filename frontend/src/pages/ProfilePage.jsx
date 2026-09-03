import { useEffect, useState } from 'react';
import { authFetch } from '../utils/auth';

export default function ProfilePage() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [profile, setProfile] = useState({ username: '', email: '', phone: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    authFetch(`${BASEURL}/api/profile/`)
      .then(async res => { if (!res.ok) throw new Error('Unable to load your profile.'); return res.json(); })
      .then(setProfile)
      .catch(error => setMessage(error.message))
      .finally(() => setLoading(false));
  }, [BASEURL]);
  const save = async (event) => {
    event.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      const res = await authFetch(`${BASEURL}/api/profile/`, {method: 'PATCH', body: JSON.stringify(profile)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.phone?.[0] || data.address?.[0] || 'Unable to save your changes.');
      setProfile(data);
      setMessage('Profile saved successfully.');
    } catch (error) { setMessage(error.message || 'Unable to save your changes.'); }
    finally { setSaving(false); }
  };
  if (loading) return <main className='grid min-h-[70vh] place-items-center text-slate-500'>Loading your profile…</main>;
  return <main className='min-h-screen bg-slate-50 px-4 py-10 md:px-8'><section className='mx-auto max-w-2xl'><p className='text-sm font-bold uppercase tracking-[.18em] text-violet-600'>Your account</p><h1 className='mt-2 text-3xl font-black text-slate-900'>My profile</h1><form onSubmit={save} className='mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8'><div className='mb-7 flex items-center gap-4'><span className='grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-xl font-black text-violet-700'>{profile.username?.charAt(0)?.toUpperCase()}</span><div><p className='font-bold text-slate-900'>{profile.username}</p><p className='text-sm text-slate-500'>Velora member</p></div></div><div className='grid gap-5 sm:grid-cols-2'><label className='text-sm font-semibold text-slate-700'>Username<input value={profile.username} disabled className='mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500'/></label><label className='text-sm font-semibold text-slate-700'>Email<input type='email' value={profile.email || ''} onChange={e => setProfile({...profile, email:e.target.value})} className='mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500'/></label></div><label className='mt-5 block text-sm font-semibold text-slate-700'>Phone number<input value={profile.phone || ''} onChange={e => setProfile({...profile, phone:e.target.value})} placeholder='Your phone number' className='mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500'/></label><label className='mt-5 block text-sm font-semibold text-slate-700'>Delivery address<textarea value={profile.address || ''} onChange={e => setProfile({...profile, address:e.target.value})} placeholder='Street, city, state and postal code' rows='4' className='mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500'/></label>{message && <p className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${message === 'Profile saved successfully.' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{message}</p>}<button disabled={saving} className='mt-6 rounded-full bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'>{saving ? 'Saving...' : message === 'Profile saved successfully.' ? 'Saved ✓' : 'Save changes'}</button></form></section></main>;
}
