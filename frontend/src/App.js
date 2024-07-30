import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateOrder from './pages/CreateOrder';
import OrdersList from './pages/OrdersList';
import './App.css'; // Import CSS file for global styles

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <ul>
            <li><Link to="/">Create Order</Link></li>
            <li><Link to="/orders">Orders List</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<CreateOrder />} />
          <Route path="/orders" element={<OrdersList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
