import React from 'react';

function AdminCheck() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token');
    
    return (
        <div style={{ padding: '20px', background: '#f8f9fa', margin: '20px', borderRadius: '5px' }}>
            <h3>Debug Information</h3>
            <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
            <p>Token exists: {token ? 'Yes' : 'No'}</p>
            <p>localStorage.isAdmin value: {localStorage.getItem('isAdmin')}</p>
        </div>
    );
}

export default AdminCheck;