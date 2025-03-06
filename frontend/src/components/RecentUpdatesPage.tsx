import React from "react";
import "./RecentUpdatesPage.css"; // Import the CSS for styling

const updates = [
  {
    date: "February 27, 2025",
    summary: "System maintenance completed successfully.",
  },
  {
    date: "March 1, 2025",
    summary: "New inventory module added for better stock tracking.",
  },
  {
    date: "March 3, 2025",
    summary: "Bug fixes and performance improvements deployed.",
  },
  {
    date: "March 5, 2025",
    summary: "Security enhancements implemented across the platform.",
  },
  {
    date: "March 6, 2025",
    summary: "New sales reporting feature released for managers.",
  },
];

const RecentUpdatesPage: React.FC = () => {
  return (
    <div className="recent-updates-container">
      <h2 className="title">Recent Updates</h2>
      <div className="timeline">
        {updates.map((update, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-date">{update.date}</div>
            <div className="timeline-content">{update.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUpdatesPage;
