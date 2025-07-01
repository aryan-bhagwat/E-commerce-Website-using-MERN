import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cart.css';

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!userId) {
            navigate('/signin');
            return;
        }
        fetchCart();
    }, [userId, navigate]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/cart/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCart(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch cart');
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/cart/update`,
                {
                    userId,
                    productId,
                    quantity: newQuantity
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchCart();
        } catch (err) {
            setError('Failed to update quantity');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setError(''); // Clear any previous errors
            console.log('Attempting to remove product:', productId); // Debug log
            
            // Make sure the URL is correct and matches your backend route
            const url = `${process.env.REACT_APP_API_URL}/cart/remove`;
            console.log('Request URL:', url); // Debug log
            
            await axios.delete(
                url,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: { 
                        userId, 
                        productId
                    }
                }
            );
            console.log('Product removed successfully'); // Debug log
            await fetchCart(); // Refresh cart after removal
        } catch (err) {
            console.error('Error removing item:', err.response?.data || err.message);
            setError('Failed to remove item from cart');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) return <div className="cart-loading">Loading...</div>;
    if (error) return <div className="cart-error">{error}</div>;
    if (!cart || !cart.products || cart.products.length === 0) {
        return <div className="cart-empty">Your cart is empty</div>;
    }

    const total = cart.products.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    );

    return (
        <div className="cart-container">
            <h2>Your Shopping Cart</h2>
            
            <div className="cart-items">
                {cart.products.map((item) => (
                    <div key={item.productId} className="cart-item">
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p>${item.price}</p>
                        </div>
                        <div className="item-quantity">
                            <button 
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="quantity-btn"
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="quantity-btn"
                            >
                                +
                            </button>
                            <button 
                                onClick={() => removeFromCart(item.productId)}
                                className="remove-btn"
                                title="Remove from cart"
                            >
                                ×
                            </button>
                        </div>
                        <div className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="cart-summary">
                <div className="cart-total">
                    <h3>Total: ${total.toFixed(2)}</h3>
                </div>
                <button 
                    className="checkout-button"
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;