import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authFetch } from '../utils/auth';

const statusStyle = { PROCESSING: 'bg-amber-100 text-amber-800', SHIPPED: 'bg-sky-100 text-sky-800', DELIVERED: 'bg-emerald-100 text-emerald-800', CANCELLED: 'bg-rose-100 text-rose-700' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    authFetch(`${BASEURL}/api/orders/`).then(async res => {
      if (!res.ok) throw new Error('We could not load your orders.');
      return res.json();
    }).then(setOrders).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [BASEURL]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    setActionMessage('');
    setCancellingId(orderId);
    try {
      const res = await authFetch(`${BASEURL}/api/orders/${orderId}/cancel/`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to cancel this order.');
      setOrders(current => current.map(order => order.id === orderId ? data.order : order));
      setActionMessage('Order cancelled successfully.');
    } catch (err) { setActionMessage(err.message); } finally { setCancellingId(null); }
  };

  if (loading) return <main className='grid min-h-[70vh] place-items-center text-slate-500'>Loading your orders…</main>;
  return <main className='min-h-screen bg-slate-50 px-4 py-10 md:px-8'><section className='mx-auto max-w-5xl'>
    <p className='text-sm font-bold uppercase tracking-[.18em] text-violet-600'>Your account</p><h1 className='mt-2 text-3xl font-black text-slate-900'>My orders</h1><p className='mt-2 text-slate-500'>Every order you place with Velora, in one place.</p>
    {error && <p className='mt-6 rounded-xl bg-rose-50 p-4 text-rose-700'>{error}</p>}{actionMessage && <p className={`mt-6 rounded-xl p-4 font-semibold ${actionMessage === 'Order cancelled successfully.' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{actionMessage}</p>}
    {!error && orders.length === 0 && <div className='mt-8 rounded-3xl bg-white px-6 py-16 text-center shadow-sm'><div className='text-4xl'>◌</div><h2 className='mt-4 text-xl font-bold'>No orders yet</h2><p className='mt-2 text-slate-500'>Find something that feels like you.</p><Link to='/' className='mt-6 inline-block rounded-full bg-violet-600 px-5 py-3 font-bold text-white'>Start shopping</Link></div>}
    <div className='mt-8 space-y-5'>{orders.map(order => <article key={order.id} className='overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4'><div><p className='font-bold text-slate-900'>Order #{order.id}</p><p className='text-sm text-slate-500'>{new Date(order.created_at).toLocaleDateString(undefined, {day:'numeric', month:'long', year:'numeric'})}</p></div><div className='flex items-center gap-3'><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[order.status] || statusStyle.PROCESSING}`}>{order.status}</span>{order.status === 'PROCESSING' && <button onClick={() => cancelOrder(order.id)} disabled={cancellingId === order.id} className='rounded-full border border-rose-200 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50'>{cancellingId === order.id ? 'Cancelling…' : 'Cancel order'}</button>}</div></div>
      <div className='divide-y divide-slate-100'>{order.items.map(item => <div key={item.id} className='flex items-center gap-4 px-5 py-4'>{item.product_image ? <img src={item.product_image} alt='' className='h-14 w-14 rounded-xl object-cover'/> : <div className='grid h-14 w-14 place-items-center rounded-xl bg-slate-100'>✦</div>}<div className='flex-1'><p className='font-semibold text-slate-800'>{item.product_name}</p><p className='text-sm text-slate-500'>Quantity: {item.quantity}</p></div><p className='font-bold text-slate-800'>₹{Number(item.price).toFixed(2)}</p></div>)}</div>
      <div className='flex justify-end bg-slate-50 px-5 py-4 text-sm'>Total <span className='ml-3 text-lg font-black text-slate-900'>₹{Number(order.total_amount).toFixed(2)}</span></div>
    </article>)}</div>
  </section></main>;
}
