import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!userId || !token) {
            navigate('/signin');
            return;
        }
        fetchOrderHistory();
    }, [userId, token, navigate]);

    const fetchOrderHistory = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/orders/history/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching order history:', err);
            setError('Failed to load order history');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'processing': return 'status-processing';
            case 'shipped': return 'status-shipped';
            case 'delivered': return 'status-delivered';
            default: return '';
        }
    };

    if (loading) return <div className="history-loading">Loading order history...</div>;
    if (error) return <div className="history-error">{error}</div>;
    if (!orders.length) return (
        <div className="history-empty">
            <p>You haven't placed any orders yet.</p>
            <Link to="/" className="shop-now-btn">Shop Now</Link>
        </div>
    );

    return (
        <div className="order-history">
            <h2>Order History</h2>
            
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div className="order-date">
                                <span>Order Date</span>
                                <p>{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="order-id">
                                <span>Order ID</span>
                                <p>{order._id}</p>
                            </div>
                            <div className="order-status">
                                <span>Status</span>
                                <p className={getStatusClass(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </p>
                            </div>
                            <div className="order-total">
                                <span>Total</span>
                                <p>${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <div className="order-products">
                            <h4>Products</h4>
                            <div className="products-summary">
                                {order.products.map((product) => (
                                    <div key={product.productId} className="product-item">
                                        <span>{product.name}</span>
                                        <span>x{product.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="order-actions">
                            <Link 
                                to={`/order-details/${order._id}`} 
                                className="view-details-btn"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderHistory; 