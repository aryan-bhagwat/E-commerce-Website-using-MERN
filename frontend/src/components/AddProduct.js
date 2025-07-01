import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddProduct.css';

function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        newCategory: ''
    });
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch existing categories
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/products/categories`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        
        fetchCategories();
    }, [token]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus('Adding product...');
            setError('');
            
            // Create a copy of the form data
            const productData = {...formData};
            
            // If "new" category is selected, use the newCategory value
            if (productData.category === 'new' && productData.newCategory) {
                productData.category = productData.newCategory;
            }
            
            // Remove the newCategory field before sending to API
            delete productData.newCategory;
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/products/add`,
                productData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setStatus('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                image: '',
                category: '',
                newCategory: ''
            });

            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err.response?.data?.error || 'Failed to add product');
            setStatus('');
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-box">
                <h2>Add New Product</h2>
                {error && <div className="error-message">{error}</div>}
                {status && <div className="status-message">{status}</div>}
                
                <form id="productForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            id="description"
                            placeholder="Product Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <input
                            type="number"
                            id="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            id="image"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <select
                            id="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                            <option value="new">Add New Category</option>
                        </select>
                    </div>

                    {formData.category === 'new' && (
                        <div className="form-group">
                            <input
                                type="text"
                                id="newCategory"
                                placeholder="New Category Name"
                                value={formData.newCategory}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;