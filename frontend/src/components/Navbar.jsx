// import {Link, useNavigate} from 'react-router-dom';
// import {useEffect, useRef, useState} from 'react';
// import {useCart} from '../context/CartContext.jsx';
// import { authFetch, clearTokens, getAccessToken } from '../utils/auth.js';

// function Navbar() {
//     const {cartItems} = useCart();
//     const navigate = useNavigate();
    
//     const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
//     const isLoggedIn = !!getAccessToken();
//     const [profile, setProfile] = useState(null);
//     const [open, setOpen] = useState(false);
//     const menuRef = useRef(null);
//     const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

//     useEffect(() => {
//         if (!isLoggedIn) return;
//         authFetch(`${BASEURL}/api/profile/`).then(res => res.ok ? res.json() : null).then(setProfile).catch(() => setProfile(null));
//     }, [isLoggedIn, BASEURL]);

//     useEffect(() => {
//         const closeMenu = (event) => !menuRef.current?.contains(event.target) && setOpen(false);
//         document.addEventListener('mousedown', closeMenu);
//         return () => document.removeEventListener('mousedown', closeMenu);
//     }, []);

//     const handleLogout = () => {
//         clearTokens();
//         setOpen(false);
//         navigate('/login');
//     };
//     return (
//         <nav className='sticky top-0 z-50 border-b border-violet-100 bg-white/90 px-4 py-3 backdrop-blur-xl md:px-8'>
//           <div className='mx-auto flex max-w-7xl items-center justify-between'>
//             <Link to='/' className='flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900'>
//              <span className='grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600 text-lg text-white shadow-lg shadow-violet-200'>V</span> Velora
//             </Link>

//             <div className='hidden items-center gap-6 text-sm font-bold text-slate-600 lg:flex'><Link to='/' className='hover:text-violet-700'>Home</Link><a href='/#collection' className='hover:text-violet-700'>Shop</a><Link to='/orders' className='hover:text-violet-700'>Orders</Link></div>

//             <div className='flex items-center gap-3 md:gap-5'>
//                 {/* Login/SignUp or Logout */}
//                 {!isLoggedIn ? (
//                     <>
//                         <Link to='/login' className='hidden text-sm font-semibold text-slate-700 hover:text-violet-600 sm:block'>
//                             Login
//                         </Link>
//                         <Link to='/signup' className='rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:scale-105'>
//                             Sign Up
//                         </Link>
//                     </>
//                 ) : (
//                     <div className='relative' ref={menuRef}>
//                       <button onClick={() => setOpen(!open)} className='flex items-center gap-2 rounded-full p-1 pr-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100'>
//                         <span className='grid h-8 w-8 place-items-center rounded-full bg-violet-100 font-bold text-violet-700'>{(profile?.username || 'U').charAt(0).toUpperCase()}</span>
//                         <span className='hidden max-w-24 truncate md:block'>{profile?.username || 'Account'}</span>
//                       </button>
//                       {open && <div className='absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl'>
//                         <div className='border-b border-slate-100 px-3 py-2'><p className='truncate text-sm font-bold text-slate-900'>{profile?.username || 'Your account'}</p><p className='truncate text-xs text-slate-500'>{profile?.email}</p></div>
//                         <Link onClick={() => setOpen(false)} to='/profile' className='mt-1 block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700'>My profile</Link>
//                         <Link onClick={() => setOpen(false)} to='/orders' className='block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700'>My orders</Link>
//                         <button onClick={handleLogout} className='mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50'>Sign out</button>
//                       </div>}
//                     </div>
//                 )}
//             </div>

//             <Link to='/cart' className='relative rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 px-3 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100 hover:from-violet-100 hover:to-fuchsia-100'>
//                 Cart <span className='hidden sm:inline'>bag</span>
//                 {cartCount > 0 && (
//                     <span className='absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2'>
//                         {cartCount}
//                     </span>
//                 )}
//             </Link>
//           </div>
//         </nav>
//     )
// }

// export default Navbar;





import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { authFetch, clearTokens, getAccessToken } from '../utils/auth.js';

function Navbar() {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const isLoggedIn = !!getAccessToken();
    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
        if (!isLoggedIn) return;

        authFetch(`${BASEURL}/api/profile/`)
            .then(res => (res.ok ? res.json() : null))
            .then(setProfile)
            .catch(() => setProfile(null));
    }, [isLoggedIn, BASEURL]);

    useEffect(() => {
        const closeMenu = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', closeMenu);

        return () => {
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    const handleLogout = () => {
        clearTokens();
        setOpen(false);
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 px-4 py-3 backdrop-blur-xl md:px-8">

            <div className="mx-auto flex max-w-7xl items-center justify-between">

                {/* ================= LOGO ================= */}
                <Link
                    to="/"
                    className="group flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900"
                >
                    <span
                        className="grid h-9 w-9 place-items-center rounded-xl 
                        bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600 
                        text-lg text-white shadow-lg shadow-violet-200 
                        transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                    >
                        V
                    </span>

                    <span className="group-hover:text-violet-700 transition">
                        Velora
                    </span>
                </Link>


                {/* ================= NAV LINKS ================= */}
                <div className="hidden items-center gap-2 lg:flex">

                    <Link
                        to="/"
                        className="rounded-full px-5 py-2.5 text-sm font-bold
                        bg-gradient-to-r from-violet-50 to-fuchsia-50
                        text-violet-700
                        border border-violet-100
                        transition-all duration-200
                        hover:from-violet-600 hover:to-fuchsia-500
                        hover:text-white
                        hover:border-transparent
                        hover:shadow-lg hover:shadow-violet-200
                        active:scale-95"
                    >
                        Home
                    </Link>

                    <a
                        href="/#collection"
                        className="rounded-full px-5 py-2.5 text-sm font-bold
                        bg-gradient-to-r from-violet-50 to-fuchsia-50
                        text-violet-700
                        border border-violet-100
                        transition-all duration-200
                        hover:from-violet-600 hover:to-fuchsia-500
                        hover:text-white
                        hover:border-transparent
                        hover:shadow-lg hover:shadow-violet-200
                        active:scale-95"
                    >
                        Shop
                    </a>

                    <Link
                        to="/orders"
                        className="rounded-full px-5 py-2.5 text-sm font-bold
                        bg-gradient-to-r from-violet-50 to-fuchsia-50
                        text-violet-700
                        border border-violet-100
                        transition-all duration-200
                        hover:from-violet-600 hover:to-fuchsia-500
                        hover:text-white
                        hover:border-transparent
                        hover:shadow-lg hover:shadow-violet-200
                        active:scale-95"
                    >
                        Orders
                    </Link>

                </div>


                {/* ================= RIGHT SIDE ================= */}
                <div className="flex items-center gap-3 md:gap-4">

                    {/* LOGIN / SIGNUP / PROFILE */}

                    {!isLoggedIn ? (
                        <>
                            {/* Login */}
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center justify-center
                                rounded-full border border-violet-200 
                                bg-white px-5 py-2 text-sm font-bold
                                text-violet-700 shadow-sm
                                transition-all duration-200
                                hover:border-violet-400
                                hover:bg-violet-50
                                hover:shadow-md
                                active:scale-95"
                            >
                                Login
                            </Link>

                            {/* Sign Up */}
                            <Link
                                to="/signup"
                                className="flex items-center justify-center
                                rounded-full 
                                bg-gradient-to-r from-violet-600 to-fuchsia-500
                                px-5 py-2.5 text-sm font-bold text-white
                                shadow-md shadow-violet-200
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:shadow-lg hover:shadow-violet-300
                                active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (

                        /* ================= PROFILE ================= */
                        <div
                            className="relative"
                            ref={menuRef}
                        >

                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 rounded-full
                                border border-slate-200 bg-white
                                p-1 pr-3 text-sm font-semibold
                                text-slate-700 shadow-sm
                                transition-all duration-200
                                hover:border-violet-200
                                hover:bg-violet-50
                                hover:shadow-md"
                            >

                                <span
                                    className="grid h-9 w-9 place-items-center
                                    rounded-full
                                    bg-gradient-to-br from-violet-500 to-fuchsia-500
                                    font-bold text-white shadow-sm"
                                >
                                    {(profile?.username || 'U')
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>

                                <span className="hidden max-w-24 truncate md:block">
                                    {profile?.username || 'Account'}
                                </span>

                                <span className="text-xs text-slate-400">
                                    ▾
                                </span>

                            </button>


                            {/* Dropdown */}
                            {open && (
                                <div
                                    className="absolute right-0 mt-3 w-60
                                    overflow-hidden rounded-2xl
                                    border border-slate-100
                                    bg-white p-2 shadow-2xl"
                                >

                                    <div className="border-b border-slate-100 px-3 py-3">
                                        <p className="truncate text-sm font-bold text-slate-900">
                                            {profile?.username || 'Your account'}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {profile?.email}
                                        </p>
                                    </div>


                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/profile"
                                        className="mt-2 block rounded-xl px-3 py-2.5
                                        text-sm font-medium text-slate-700
                                        transition hover:bg-violet-50
                                        hover:text-violet-700"
                                    >
                                        👤 My Profile
                                    </Link>


                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/orders"
                                        className="block rounded-xl px-3 py-2.5
                                        text-sm font-medium text-slate-700
                                        transition hover:bg-violet-50
                                        hover:text-violet-700"
                                    >
                                        📦 My Orders
                                    </Link>


                                    <button
                                        onClick={handleLogout}
                                        className="mt-1 w-full rounded-xl px-3 py-2.5
                                        text-left text-sm font-semibold
                                        text-rose-600 transition
                                        hover:bg-rose-50"
                                    >
                                        ↪ Sign Out
                                    </button>

                                </div>
                            )}

                        </div>
                    )}


                    {/* ================= CART ================= */}
                    <Link
                        to="/cart"
                        className="group relative flex items-center gap-1.5
                        rounded-full border border-violet-200
                        bg-gradient-to-r from-violet-50 to-fuchsia-50
                        px-4 py-2.5 text-sm font-bold text-violet-700
                        shadow-sm transition-all duration-200
                        hover:-translate-y-0.5
                        hover:border-violet-300
                        hover:from-violet-100 hover:to-fuchsia-100
                        hover:shadow-md
                        active:scale-95"
                    >

                        <span className="text-base transition group-hover:scale-110">
                            🛒
                        </span>

                        <span>
                            Cart
                        </span>

                        <span className="hidden sm:inline">
                            Bag
                        </span>


                        {/* Cart Count */}
                        {cartCount > 0 && (
                            <span
                                className="absolute -right-2 -top-2
                                min-w-5 h-5 px-1
                                flex items-center justify-center
                                rounded-full
                                bg-gradient-to-r from-rose-500 to-red-500
                                text-[11px] font-black text-white
                                shadow-md shadow-red-200
                                ring-2 ring-white"
                            >
                                {cartCount}
                            </span>
                        )}

                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;

