// function ProductCard({ product }){
//     const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
//     return (
//               <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">
//                    <img
//                        src={`${BASEURL}${product.image}`}
//                        alt={product.name}
//                        className="w-full h-56 object-cover rounded-lg mb-4"
//                     />
//                     <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
//                     <p className="text-gray-600 font-medium">${product.price}</p>
//             </div>
            
//     )
// }


// export default ProductCard;

import { Link } from "react-router-dom";
import { formatPrice, productImage } from '../utils/store';
function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`} className="group block h-full">
        <article className="h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/70">
            <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {product.image ? <img src={productImage(product.image)} alt={product.name} className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" /> : <span className="text-4xl text-slate-300">✦</span>}
                {product.category?.name && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur">{product.category.name}</span>}
            </div>
            <div className="px-2 pb-2 pt-4"><h2 className="truncate text-base font-bold text-slate-900">{product.name}</h2><p className="mt-1 text-sm text-slate-500">Curated for everyday living</p><p className="mt-3 text-lg font-black text-violet-700">{formatPrice(product.price)}</p></div>
        </article>
        </Link>
    );
}

export default ProductCard;
