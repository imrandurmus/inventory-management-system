import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import "./EmployeePage.css";

const EmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Redirect only if user is at "/Employee-Dashboard" (without sub-route)
    if (location.pathname === "/Employee-Dashboard") {
      navigate("/employee/home", { replace: true });
    } else {
      setIsHomePage(location.pathname === "/employee/home");
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const toggleSalesDropdown = () => {
    setIsSalesDropdownOpen(!isSalesDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`employee-page-container ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            {isSidebarOpen ? "❮" : "❯"}
          </button>
          {isSidebarOpen && (
            <Link to="/employee/home">
              <img src="/Draft_logo.png" alt="SIMple Logo" className="sidebar-logo" />
            </Link>
          )}
          {isSidebarOpen && <h2>SIMple</h2>}
        </div>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <Link to="/employee/home">Home</Link>
            </li>
            <li>
              <Link to="/employee/inventory">Inventory</Link>
            </li>
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
        </nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </aside>

      {/* Content Area */}
      <main className="content-container">
        {isHomePage && <div className="top-navbar"></div>}
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeePage;
