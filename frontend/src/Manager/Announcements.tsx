import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../DashComponents/Header';
import '../CSS/Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [userRole, setUserRole] = useState<'MANAGER' | 'REGULAR'>('REGULAR');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate here
  
  useEffect(() => {
    // MOCK DATA for Now, remove later when integrating with backend
    const mockAnnouncements: Announcement[] = [
      {
        id: 1,
        title: 'New Product Launch 🚀',
        date: '2025-04-01',
        read: false,
        content: 'We are excited to announce the launch of our brand-new product line. Join the kickoff event next Monday!',
        category: 'News',
      },
      {
        id: 2,
        title: 'Team Building Activity 🏞️',
        date: '2025-03-28',
        read: true,
        content: 'Don’t forget the team-building retreat this weekend at Lakeview Park. Lunch and games provided!',
        category: 'Activities',
      },
      {
        id: 3,
        title: 'Quarterly Earnings Report 📊',
        date: '2025-03-20',
        read: false,
        content: 'The latest earnings report has been published. Highlights include a 15% increase in sales...',
        category: 'News',
      },
    ];
  
    setAnnouncements(mockAnnouncements);
    setUserRole('MANAGER');
  }, []);
  
  const filtered = announcements
    .filter(a => (filterUnread ? !a.read : true))
    .filter(a =>
      activeTab === 'All' ? true : a.category === activeTab
    )
    .filter(a =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
  <Header />
    <div className="announcements-background">
      
    <div className="announcements-header d-flex align-items-center mb-4 px-4">
    <img
          className="announcements-icon"
          src="/AnnounementsMegaphone.png"
          alt="Announcements Icon"
        />
        <h2 className="announcements-title ms-3 mb-0">Announcements</h2>
      </div>
      <div className="announcements-container container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          {userRole === 'MANAGER' && (
            <Button as={Link} to="/announcements/new" className="add-btn">
              Add New
            </Button>
          )}
        </div>

        {/* Announcement List */}
        <div className="announcement-list">
          {filtered.map(a => (
            <div
              key={a.id}
              className="announcement-card"
              onClick={() => {
                if (!a.read) {
                  fetch(`/api/announcements/${a.id}/mark-as-read`, {
                    method: 'PATCH',
                    credentials: 'include',
                  })
                  .then(() => {
                    // Update local state to reflect that this announcement has been read
                    setAnnouncements(prev =>
                      prev.map(ann =>
                        ann.id === a.id ? { ...ann, read: true } : ann
                      )
                    );
                  })
                  .catch(err => console.error('Failed to mark as read:', err));
                }
              
                navigate(`/announcements/${a.id}`);
              }}
               // Use navigate here
            >
              <div className="announcement-date">
                {new Date(a.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div className={`announcement-title ${!a.read ? 'unread' : ''}`}>
                {a.title}
              </div>
              <div className="announcement-preview">
                {a.content.slice(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Announcements;
