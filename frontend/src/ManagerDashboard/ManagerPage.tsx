import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import "./ManagerPage.css";

const ManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Redirect only if user is at "/Manager-Dashboard" (without sub-route)
    if (location.pathname === "/Manager-Dashboard") {
      navigate("/manager/home", { replace: true });
    } else {
      setIsHomePage(location.pathname === "/manager/home");
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
    <div className={`manager-page-container ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      {/*sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            {isSidebarOpen ? "❮" : "❯"}
          </button>
          {isSidebarOpen && (
            <Link to="/manager/home">
              <img src="/Draft_logo.png" alt="SIMple Logo" className="sidebar-logo" />
            </Link>
          )}
          {isSidebarOpen && <h2>SIMple</h2>}
        </div>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <Link to="/manager/home">Home</Link>
            </li>
            <li>
              <Link to="/manager/inventory">Inventory</Link>
            </li>
            <li className={`dropdown ${isSalesDropdownOpen ? "open" : ""}`}>
              <button className="dropdown-button" onClick={toggleSalesDropdown}>
                Sales ▼
              </button>
              {isSalesDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/manager/sales/customers">Customers</Link></li>
                  <li><Link to="/manager/sales/orders">Sales Orders</Link></li>
                  <li><Link to="/manager/sales/packages">Packages</Link></li>
                  <li><Link to="/manager/sales/shipments">Shipments</Link></li>
                  <li><Link to="/manager/sales/invoices">Invoices</Link></li>
                  <li><Link to="/manager/sales/payments">Payments Received</Link></li>
                  <li><Link to="/manager/sales/returns">Sales Returned</Link></li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/manager/purchases">Purchases</Link>
            </li>
            <li>
              <Link to="/manager/reports">Reports</Link>
            </li>
            <li>
              <Link to="/manager/staff">Staff</Link>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </aside>

      {/* content Area */}
      <main className="content-container">
        {isHomePage && <div className="top-navbar"></div>}
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerPage;
