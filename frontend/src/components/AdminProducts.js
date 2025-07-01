import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminProducts.css';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteStatus, setDeleteStatus] = useState('');
    const navigate = useNavigate();
    
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        // Redirect if not admin
        if (!isAdmin) {
            navigate('/');
            return;
        }
        
        fetchProducts();
    }, [isAdmin, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/products/all`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setDeleteStatus(`Deleting product...`);
                await axios.delete(
                    `${process.env.REACT_APP_API_URL}/products/delete/${productId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setDeleteStatus('Product deleted successfully');
                // Refresh the product list
                fetchProducts();
                
                // Clear status message after 3 seconds
                setTimeout(() => {
                    setDeleteStatus('');
                }, 3000);
            } catch (err) {
                console.error('Error deleting product:', err);
                setDeleteStatus('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading products...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-products-container">
            <h2>Manage Products</h2>
            {deleteStatus && <div className="status-message">{deleteStatus}</div>}
            
            <div className="admin-actions">
                <button onClick={() => navigate('/add-product')} className="add-product-btn">
                    Add New Product
                </button>
            </div>
            
            <div className="admin-products-grid">
                {products.map(product => (
                    <div key={product._id} className="admin-product-card">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                        />
                        <div className="admin-product-details">
                            <h3>{product.name}</h3>
                            <p className="admin-product-price">${product.price.toFixed(2)}</p>
                            <p className="admin-product-category">{product.category}</p>
                            <div className="admin-product-actions">
                                <button 
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProducts;