import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import { useNavigate } from 'react-router-dom';

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartStatus, setCartStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add this effect to ensure categories are loaded after products
    useEffect(() => {
        if (products.length > 0) {
            extractCategoriesFromProducts();
        }
    }, [products]);

    // Apply filtering whenever searchTerm or selectedCategory changes
    useEffect(() => {
        if (products.length > 0) {
            let filtered = [...products];
            
            // Apply search filter
            if (searchTerm.trim() !== '') {
                const searchTermLower = searchTerm.toLowerCase();
                filtered = filtered.filter(product => 
                    (product.name && product.name.toLowerCase().includes(searchTermLower)) ||
                    (product.description && product.description.toLowerCase().includes(searchTermLower)) ||
                    (product.category && product.category.toLowerCase().includes(searchTermLower))
                );
            }
            
            // Apply category filter
            if (selectedCategory && selectedCategory !== '') {
                filtered = filtered.filter(product => 
                    product.category === selectedCategory
                );
            }
            
            setFilteredProducts(filtered);
        }
    }, [searchTerm, selectedCategory, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/products/all`);
            setProducts(response.data);
            setFilteredProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products");
            setLoading(false);
        }
    };

    // Helper function to extract unique categories from products
    const extractCategoriesFromProducts = () => {
        if (products && products.length > 0) {
            const uniqueCategories = [...new Set(
                products
                    .map(product => product.category)
                    .filter(category => 
                        category && typeof category === 'string' && category.trim() !== ''
                    )
            )];
            setCategories(uniqueCategories);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const addToCart = async (productId, name, price) => {
        try {
            setCartStatus('Adding to cart...');
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            if (!userId || !token) {
                navigate('/signin');
                return;
            }
            
            await axios.post(`${API_URL}/cart/add`, {
                userId,
                productId,
                name,
                price
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setCartStatus('Added to cart successfully!');
            setTimeout(() => setCartStatus(''), 3000);
        } catch (err) {
            console.error("Error adding to cart:", err);
            setCartStatus('Failed to add to cart');
            setTimeout(() => setCartStatus(''), 3000);
        }
    };

    if (loading) return <div className="products-loading">Loading...</div>;
    if (error) return <div className="products-error">{error}</div>;
    if (!products.length) return <div className="products-empty">No products available</div>;

    return (
        <div className="products-container">
            <h1>Products</h1>
            
            <div className="filters-container">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input-full"
                    />
                </div>
                
                {categories.length > 0 && (
                    <div className="category-filter">
                        <select 
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                            className="category-select"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            
            {cartStatus && <div className="cart-status">{cartStatus}</div>}
            
            {filteredProducts.length === 0 && (searchTerm || selectedCategory) && (
                <div className="no-results">
                    No products found matching your criteria
                    {searchTerm && <span> "{searchTerm}"</span>}
                    {selectedCategory && <span> in category "{selectedCategory}"</span>}
                </div>
            )}
            
            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <h3>{product.name || 'Unnamed Product'}</h3>
                        <p>{product.description || 'No description available'}</p>
                        <p className="price">${product.price?.toFixed(2) || '0.00'}</p>
                        <p className="category">Category: {product.category || 'Uncategorized'}</p>
                        {product.image && (
                            <img 
                                src={product.image} 
                                alt={product.name || 'Product image'}
                                className="product-image"
                            />
                        )}
                        <button 
                            onClick={() => addToCart(product._id, product.name || 'Unnamed Product', product.price || 0)}
                            disabled={cartStatus === 'Adding to cart...'}
                            className="add-to-cart-btn"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products; 