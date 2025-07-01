import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Checkout.css';

function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        paymentMethod: 'credit_card'
    });
    const [orderStatus, setOrderStatus] = useState('');

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!userId || !token) {
            navigate('/signin');
            return;
        }
        fetchCart();
    }, [userId, token, navigate]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/cart/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCart(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load cart. Please try again.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value, name } = e.target;
        
        // Special handling for radio buttons
        if (name === 'paymentMethod') {
            setFormData({
                ...formData,
                paymentMethod: id
            });
        } else {
            setFormData({
                ...formData,
                [id]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setOrderStatus('Processing your order...');
            
            const orderData = {
                userId,
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                },
                paymentMethod: formData.paymentMethod
            };
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/orders/create`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            navigate('/order-confirmation', { state: { orderId: response.data._id } });
        } catch (err) {
            console.error('Error creating order:', err);
            setOrderStatus('Failed to create order. Please try again.');
        }
    };

    if (loading) return <div className="loading">Loading checkout information...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="empty-cart-message">
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart before checking out.</p>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.products.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="checkout-container">
            <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="cart-items">
                    {cart.products.map((item, index) => (
                        <div key={index} className="cart-item">
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>Quantity: {item.quantity}</p>
                                <p>${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-total">
                    <h3>Total</h3>
                    <h3>${calculateTotal()}</h3>
                </div>
            </div>

            <div className="checkout-form">
                <h2>Shipping Information</h2>
                {orderStatus && <div className="order-status">{orderStatus}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="shipping-address">
                        <h3>Shipping Address</h3>
                        <input
                            type="text"
                            id="street"
                            placeholder="Street Address"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <div className="form-row">
                            <div>
                                <input
                                    type="text"
                                    id="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="state"
                                    placeholder="State/Province"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div>
                                <input
                                    type="text"
                                    id="zipCode"
                                    placeholder="ZIP/Postal Code"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="country"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="payment-method">
                        <h3>Payment Method</h3>
                        <div className="payment-options">
                            <div className={`payment-option ${formData.paymentMethod === 'credit_card' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    id="credit_card"
                                    name="paymentMethod"
                                    checked={formData.paymentMethod === 'credit_card'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="credit_card">Credit Card</label>
                            </div>
                            
                            <div className={`payment-option ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="paymentMethod"
                                    checked={formData.paymentMethod === 'paypal'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="paypal">PayPal</label>
                            </div>
                            
                            <div className={`payment-option ${formData.paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    id="cash_on_delivery"
                                    name="paymentMethod"
                                    checked={formData.paymentMethod === 'cash_on_delivery'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="cash_on_delivery">Cash on Delivery</label>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="place-order-btn">Place Order</button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;