import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./AdminPage.css";

const AdminPage: React.FC = () => {
  return (
    <div className="admin-dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/Admin-Dashboard">Dashboard</Link></li>
            {/*<li><Link to="/Admin-Dashboard/manage-companies">Manage Companies</Link></li>
            <li><Link to="/Admin-Dashboard/manage-managers">Manage Managers</Link></li>*/}
            <li><Link to="/Employee-Dashboard/home">Employee Dashboard</Link></li>
            <li><Link to="/Manager-Dashboard/home">Manager Dashboard</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1 className="dashboard-title">Welcome to the Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage your system efficiently</p>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Companies</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <h3>Total Managers</h3>
            <p>25</p>
          </div>
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p>150</p>
          </div>
        </div>

        <div className="quick-actions">
          {/*<Link to="/Admin-Dashboard/manage-companies" className="action-button">Manage Companies</Link>
          <Link to="/Admin-Dashboard/manage-managers" className="action-button">Manage Managers</Link>*/}
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
