import React, { useState } from 'react';
import axios from 'axios';
import './CreateOrder.css';

const CreateOrder = () => {
  const [newOrder, setNewOrder] = useState({
    tableNumber: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    total: 0,
    status: 'Pending',
  });

  const handleCreateOrder = async () => {
    try {
      await axios.post('/orders', newOrder);
      resetOrderForm();
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setNewOrder({ ...newOrder, items: updatedItems, total: updatedTotal });
  };

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setNewOrder({ ...newOrder, items: updatedItems, total: updatedTotal });
  };

  const resetOrderForm = () => {
    setNewOrder({
      tableNumber: '',
      items: [{ name: '', quantity: 1, price: 0 }],
      total: 0,
      status: 'Pending',
    });
  };

  return (
    <div className="order-container">
      <h1>Create New Order</h1>
      <div className="form-container">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateOrder(); }}>
          <div className="form-group">
            <label htmlFor="tableNumber">Table Number:</label>
            <input
              id="tableNumber"
              type="number"
              value={newOrder.tableNumber}
              onChange={(e) => setNewOrder({ ...newOrder, tableNumber: e.target.value })}
              required
            />
          </div>

          {newOrder.items.map((item, index) => (
            <div key={index} className="form-group item-group">
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                required
                min="1"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                required
                step="0.01"
              />
              <button type="button" onClick={() => removeItem(index)}>Remove Item</button>
            </div>
          ))}
          
          <button type="button" onClick={addItem}>Add Item</button>

          <div className="form-group">
            <label htmlFor="total">Total:</label>
            <input
              id="total"
              type="text"
              value={`$${newOrder.total.toFixed(2)}`}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={newOrder.status}
              onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit">Create Order</button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
