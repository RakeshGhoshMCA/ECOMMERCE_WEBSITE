import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Nabvar from './components/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRouter from './components/PrivateRouter';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Nabvar/>
            <Routes>
                <Route path="/" element={<ProductList/>}/>
                <Route path="/product/:id" element={<ProductDetails/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route element={<PrivateRouter/>}>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                    <Route path="/orders" element={<OrdersPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                </Route>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
