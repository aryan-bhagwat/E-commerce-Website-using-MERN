import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Products from './components/Products';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Cart from './components/Cart';
import AddProduct from './components/AddProduct';
import AdminProducts from './components/AdminProducts';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import './App.css';
// Remove this import since we won't need it anymore
// import AdminCheck from './components/AdminCheck';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        // Check login status whenever localStorage changes
        const checkLoginStatus = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        };

        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.location.href = '/';
    };

    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <Link to="/" className="nav-brand">Shopee</Link>
                    <div className="nav-links">
                        {isLoggedIn ? (
                            <>
                                <Link to="/">Home</Link>
                                <Link to="/cart">Cart</Link>
                                {isAdmin && (
                                    <>
                                        {/* Removed the Add Product link and kept only Manage Products */}
                                        <Link to="/manage-products" className="admin-link">Manage Products</Link>
                                    </>
                                )}
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/signin">Sign In</Link>
                                <Link to="/signup">Sign Up</Link>
                            </>
                        )}
                    </div>
                </nav>
                
                {/* Remove the AdminCheck component from here */}
                {/* {isLoggedIn && <AdminCheck />} */}

                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/cart" element={<Cart />} />
                    {/* Protect the Admin routes */}
                    <Route path="/add-product" element={isAdmin ? <AddProduct /> : <Navigate to="/" />} />
                    <Route path="/manage-products" element={isAdmin ? <AdminProducts /> : <Navigate to="/" />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
