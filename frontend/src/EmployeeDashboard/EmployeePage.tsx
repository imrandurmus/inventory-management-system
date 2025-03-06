import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import "./EmployeePage.css";

const EmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);

  // Check if on Home Page
  useEffect(() => {
    setIsHomePage(location.pathname === "/employee/home");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Clear user role
    navigate("/"); // Redirect to login
  };

  const toggleSalesDropdown = () => {
    setIsSalesDropdownOpen(!isSalesDropdownOpen);
  };

  return (
    <div className="employee-page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="SIMple Logo" className="sidebar-logo" />
          <h2>SIMple</h2>
        </div>
        <ul>
          <li>
            <Link to="/employee/home">Home</Link>
          </li>
          <li>
            <Link to="/employee/inventory">Inventory</Link>
          </li>
          {/* Sales Link with Dropdown */}
          <li className={`dropdown ${isSalesDropdownOpen ? "open" : ""}`}>
            <button className="dropdown-button" onClick={toggleSalesDropdown}>
              Sales ▼
            </button>
            {isSalesDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/employee/sales/customers">Customers</Link></li>
                <li><Link to="/employee/sales/orders">Sales Orders</Link></li>
                <li><Link to="/employee/sales/packages">Packages</Link></li>
                <li><Link to="/employee/sales/shipments">Shipments</Link></li>
                <li><Link to="/employee/sales/invoices">Invoices</Link></li>
                <li><Link to="/employee/sales/payments">Payments Received</Link></li>
                <li><Link to="/employee/sales/returns">Sales Returned</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/employee/purchases">Purchases</Link>
          </li>
          <li>
            <Link to="/employee/reports">Reports</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Content Area */}
      <div className="content-container">
        {/* Show Top Navbar only on Home Page */}
        {isHomePage && <div className="top-navbar"></div>}

        {/* Render Child Routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeePage;
