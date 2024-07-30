import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderEditModal.css'; // Ensure you have CSS for styling

const OrderEditModal = ({ order, onClose, onSave }) => {
  const [editingOrder, setEditingOrder] = useState(order);

  useEffect(() => {
    setEditingOrder(order);
  }, [order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingOrder({ ...editingOrder, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editingOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setEditingOrder({ ...editingOrder, items: updatedItems, total: updatedTotal });
  };

  const addItem = () => {
    setEditingOrder({
      ...editingOrder,
      items: [...editingOrder.items, { name: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = editingOrder.items.filter((_, i) => i !== index);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setEditingOrder({ ...editingOrder, items: updatedItems, total: updatedTotal });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/orders/${editingOrder._id}`, editingOrder);
      onSave();
    } catch (error) {
      console.error('Error updating order:', error);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Order</h2>
        <form>
          <div className="form-group">
            <label htmlFor="editTableNumber">Table Number:</label>
            <input
              id="editTableNumber"
              type="number"
              name="tableNumber"
              value={editingOrder.tableNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {editingOrder.items.map((item, index) => (
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
            <label htmlFor="editTotal">Total:</label>
            <input
              id="editTotal"
              type="text"
              value={`$${editingOrder.total.toFixed(2)}`}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="editStatus">Status:</label>
            <select
              id="editStatus"
              name="status"
              value={editingOrder.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="button" onClick={handleSave}>Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default OrderEditModal;
