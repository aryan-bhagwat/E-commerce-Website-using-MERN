import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const orderId = location.state?.orderId;
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!orderId) {
            setError('Order information not found');
            setLoading(false);
            return;
        }
        
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setOrder(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to load order details');
            setLoading(false);
        }
    };

    if (loading) return <div className="order-loading">Loading order details...</div>;
    if (error) return <div className="order-error">{error}</div>;
    if (!order) return <div className="order-not-found">Order not found</div>;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="order-confirmation">
            <div className="confirmation-header">
                <h2>Order Confirmation</h2>
                <div className="order-success">
                    <i className="checkmark">✓</i>
                    <p>Your order has been placed successfully!</p>
                </div>
            </div>

            <div className="order-details">
                <div className="order-info">
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                    <p><strong>Status:</strong> <span className="status">{order.status}</span></p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                </div>

                <div className="shipping-info">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                </div>
            </div>

            <div className="order-items">
                <h3>Order Items</h3>
                <div className="items-list">
                    {order.products.map((item) => (
                        <div key={item.productId} className="order-item">
                            <div className="item-name">{item.name}</div>
                            <div className="item-details">
                                <span>{item.quantity} x ${item.price}</span>
                                <span>${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-total">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <div className="confirmation-actions">
                <Link to="/" className="continue-shopping">Continue Shopping</Link>
                <Link to="/order-history" className="view-orders">View All Orders</Link>
            </div>
        </div>
    );
}

export default OrderConfirmation; 