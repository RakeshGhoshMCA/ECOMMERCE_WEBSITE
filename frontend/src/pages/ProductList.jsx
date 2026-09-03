import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { apiUrl } from '../utils/store';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (activeCategory) params.set('category', activeCategory);
        setLoading(true);
        fetch(`${BASEURL}/api/products/?${params}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .then((data)=>{
            setProducts(data);
            setLoading(false);
        })
        .catch((error)=>{
            setError(error.message);
            setLoading(false);
        });
    }, [BASEURL, search, activeCategory]);

    useEffect(() => { fetch(apiUrl('/api/categories/')).then(res => res.json()).then(setCategories).catch(() => setCategories([])); }, []);

    if (loading && products.length === 0) {
        return <div className="grid min-h-[70vh] place-items-center text-slate-500">Loading the collection…</div>;
    }

    if (error) {
        return <div className="grid min-h-[70vh] place-items-center text-rose-600">Unable to load products: {error}</div>;
    }

    return (
        <main className="min-h-screen overflow-hidden bg-slate-50">
          <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-16 md:px-8 md:py-24"><div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-fuchsia-500/40 blur-3xl"/><div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl"/><div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center"><div><p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-fuchsia-200">The colorful everyday edit</p><h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl">Good things, <span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-200 bg-clip-text text-transparent">beautifully</span> found.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-violet-100">Discover useful, joyful picks for every room, routine and little moment that matters.</p><div className="mt-8 flex max-w-2xl items-center rounded-2xl border border-white/15 bg-white p-2 shadow-2xl"><span className="px-3 text-lg text-violet-700">⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the Velora collection..." className="w-full bg-transparent px-2 py-3 text-slate-800 outline-none" /></div><a href="#collection" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-bold text-violet-800 transition hover:bg-fuchsia-100">Explore the collection ↓</a></div><div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4"><div className="mt-10 rounded-[2rem] bg-gradient-to-br from-orange-300 to-rose-400 p-5 text-white shadow-2xl"><p className="text-sm font-bold">Curated goods</p><p className="mt-10 text-4xl">✦</p><p className="mt-4 text-lg font-black">Made for daily joy</p></div><div className="rounded-[2rem] bg-gradient-to-br from-cyan-300 to-blue-500 p-5 text-white shadow-2xl"><p className="text-sm font-bold">Easy shopping</p><p className="mt-10 text-4xl">◌</p><p className="mt-4 text-lg font-black">Simple, secure, yours</p></div></div></div></section>
          <section className="relative z-10 mx-auto -mt-6 grid max-w-6xl gap-3 px-4 sm:grid-cols-3 md:px-8"><div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-300/30"><p className="text-2xl">✦</p><p className="mt-2 font-black text-slate-900">Curated collection</p><p className="mt-1 text-sm text-slate-500">Useful finds, selected with care.</p></div><div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-300/30"><p className="text-2xl">↗</p><p className="mt-2 font-black text-slate-900">Fast checkout</p><p className="mt-1 text-sm text-slate-500">A clear path from cart to order.</p></div><div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-300/30"><p className="text-2xl">✓</p><p className="mt-2 font-black text-slate-900">Order control</p><p className="mt-1 text-sm text-slate-500">Track or cancel eligible orders easily.</p></div></section>
          <section id="collection" className="mx-auto max-w-7xl px-4 py-14 md:px-8"><div className="flex flex-wrap gap-2"> <button onClick={() => setActiveCategory('')} className={`rounded-full px-4 py-2 text-sm font-bold transition ${!activeCategory ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-violet-300'}`}>All products</button>{categories.map(category => <button key={category.id} onClick={() => setActiveCategory(category.slug)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category.slug ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-violet-300'}`}>{category.name}</button>)}</div>
            <div className="mt-9 flex items-end justify-between"><div><h2 className="text-2xl font-black text-slate-900">The collection</h2><p className="mt-1 text-sm text-slate-500">{products.length} product{products.length === 1 ? '' : 's'} available</p></div></div>
            {loading && <p className="mt-5 text-sm font-medium text-violet-600">Updating products…</p>}<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full rounded-3xl bg-white py-20 text-center shadow-sm"><p className="text-xl font-bold text-slate-800">No products found</p><p className="mt-2 text-slate-500">Try a different search or category.</p><button onClick={() => { setSearch(''); setActiveCategory(''); }} className="mt-5 font-bold text-violet-700">Clear filters</button></div>
                )}
            </div></section>
        </main>
    )
}

export default ProductList;
