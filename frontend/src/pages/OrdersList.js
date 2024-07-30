import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderEditModal from '../components/OrderEditModal';
import './OrdersList.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchTotalSales();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchTotalSales = async () => {
    try {
      const response = await axios.get('/total-sales');
      setTotalSales(response.data.totalSales);
    } catch (error) {
      console.error('Error fetching total sales:', error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`/orders/${id}`);
      fetchOrders();
      fetchTotalSales();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleSaveOrder = () => {
    fetchOrders();
    fetchTotalSales();
    setSelectedOrder(null);
  };

  return (
    <div className="order-container">
      <h1>Orders List</h1>

      <div className="total-sales">
        <h2>Total Sales: ${totalSales.toFixed(2)}</h2>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <ul>
            {orders.map(order => (
              <li key={order._id} className="order-item">
                <div>
                  <strong>Table {order.tableNumber}</strong>
                  <p>{order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                  <p>Status: {order.status}</p>
                </div>
                <div>
                  <button style={{background: "green"}} onClick={() => handleEditOrder(order)}>Edit</button>
                  <button onClick={() => handleDeleteOrder(order._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedOrder && (
        <OrderEditModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
};

export default OrdersList;
