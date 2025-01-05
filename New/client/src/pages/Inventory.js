import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/inventory.css';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    fetchInventory();
  }, [navigate]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/food-stock');
      setInventory(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory');
      setIsLoading(false);
    }
  };

  const handleOrderStock = async () => {
    try {
      const response = await axios.post('/api/order-stock');
      if (response.data.orders && response.data.orders.length > 0) {
        alert('Orders placed successfully for items below threshold');
      } else {
        alert('No items need to be ordered at this time');
      }
      fetchInventory();
    } catch (err) {
      setError('Failed to place orders');
    }
  };

  if (isLoading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Food Inventory</h2>
      <div className="order-button">
        <button onClick={handleOrderStock}>Order Stock</button>
      </div>
      <div className="table-container">
        {inventory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Items per Box</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>
                    <span className="item-icon">🍽️</span>
                    {item.item_name}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.items_per_box}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-4">No food stock available.</div>
        )}
      </div>
    </div>
  );
}

export default Inventory; 