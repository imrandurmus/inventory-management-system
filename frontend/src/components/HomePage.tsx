import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Import the CSS for styling

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container">
      {/* Welcome Message */}
      <h2 className="welcome-message">Welcome Back, Imran!</h2>

      {/* Buttons */}
      <div className="button-container">
        <Link to="/employee/profile">
          <button className="home-button">Profile</button>
        </Link>
        <Link to="/employee/dashboard">
          <button className="home-button">Dashboard</button>
        </Link>
      </div>
      <div className="button-container">
        <Link to="/employee/announcements">
          <button className="home-button">Announcements</button>
        </Link>
        <Link to="/employee/recent-updates">
          <button className="home-button">Recent Updates</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
