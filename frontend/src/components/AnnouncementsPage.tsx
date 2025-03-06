import React from "react";
import "./AnnouncementsPage.css"; // Import the CSS for styling

const AnnouncementsPage: React.FC = () => {
  return (
    <div className="announcements-container">
      {/* Announcement Image */}
      <img
        src="/Announcemnt.png"
        alt="Announcements"
        className="announcement-image"
      />

      {/* Announcement Text */}
      <h2 className="announcement-title">Never miss an announcement</h2>
      <p className="announcement-subtext">
        This tab is your one-stop hub to keep track of our latest events,
        webinars, and important updates.
      </p>
    </div>
  );
};

export default AnnouncementsPage;
