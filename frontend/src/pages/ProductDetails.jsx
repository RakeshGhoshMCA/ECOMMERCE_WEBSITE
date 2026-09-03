import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice, productImage } from '../utils/store';

function ProductDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  if (loading) {
    return <div className="grid min-h-[70vh] place-items-center text-slate-500">Loading product…</div>;
  }
  if (error) {
    return <div className="grid min-h-[70vh] place-items-center text-rose-600">{error}</div>;
  }
  if (!product) {
    return <div className="grid min-h-[70vh] place-items-center text-slate-500">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if(!localStorage.getItem('access_token')){
      navigate('/login');
      return;
    }
    addToCart(product.id);
  }
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl"><Link to="/" className="text-sm font-bold text-violet-700">← Back to collection</Link><div className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col md:flex-row">
          <div className="flex min-h-80 flex-1 items-center justify-center bg-slate-100 p-8">{product.image ? <img src={productImage(product.image)} alt={product.name} className="max-h-96 w-full object-contain" /> : <span className="text-6xl text-slate-300">✦</span>}</div>
          <div className="flex-1">
            <div className="p-8 md:p-12"><p className="text-sm font-bold uppercase tracking-[.18em] text-violet-600">{product.category?.name || 'Velora selection'}</p><h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{product.name}</h1><p className="mt-6 leading-7 text-slate-600">{product.description || 'A thoughtfully selected item for your everyday needs.'}</p><p className="mt-8 text-3xl font-black text-slate-900">{formatPrice(product.price)}</p><button onClick={handleAddToCart} className="mt-8 w-full rounded-full bg-violet-600 px-6 py-4 font-bold text-white transition hover:bg-violet-700 sm:w-auto">Add to cart</button><p className="mt-5 text-sm text-slate-500">Secure checkout · Cash on delivery available</p></div>
          </div>
        </div></div></div>
    </main>
  );
}

export default ProductDetails;
