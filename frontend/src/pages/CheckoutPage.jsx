import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";
import { formatPrice } from '../utils/store';

function CheckoutPage() {
  const [form, setForm] = useState({ name: "", address: "", phone: "", payment_method: "COD" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    authFetch(`${BASEURL}/api/profile/`).then(res => res.ok ? res.json() : null).then(profile => profile && setForm(current => ({ ...current, name: profile.username || '', address: profile.address || '', phone: profile.phone || '' }))).catch(() => {});
  }, [BASEURL]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSubmitting(true);
    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        nav("/orders");
      } else {
        setMessage(data.error || "Unable to place your order.");
      }
    } catch {
      setMessage("Unable to place your order. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (!cartItems.length) return <main className="grid min-h-[70vh] place-items-center bg-slate-50 text-center"><div><h1 className="text-2xl font-black">Your cart is empty</h1><Link to="/" className="mt-4 inline-block font-bold text-violet-700">Return to products</Link></div></main>;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_340px]">
      <div><p className="text-sm font-bold uppercase tracking-[.18em] text-violet-600">Secure checkout</p><h1 className="mt-2 text-3xl font-black">Delivery details</h1>
      <div className="mt-7 bg-white p-6 shadow-sm ring-1 ring-slate-100 rounded-3xl md:p-8">

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, city, state and postal code"
            required
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>

          {message && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{message}</p>}
          <button disabled={submitting} className="w-full rounded-full bg-violet-600 py-4 font-bold text-white disabled:opacity-60">
            {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
        </form>
      </div></div>
      <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><h2 className="font-black text-slate-900">Your order</h2><div className="mt-5 space-y-3">{cartItems.map(item => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-slate-600">{item.product_name} × {item.quantity}</span><span className="font-bold">{formatPrice(Number(item.product_price) * item.quantity)}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-slate-100 pt-5 text-lg font-black"><span>Total</span><span>{formatPrice(total)}</span></div></aside>
      </div>
    </main>
  );
}

export default CheckoutPage;
