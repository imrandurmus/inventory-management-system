// frontend/src/Manager/Announcements.tsx
import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../DashComponents/Header';
import { getAnnouncements, Announcement } from '../../services/api';
import '../CSS/Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="announcements-background">
        <Header />
        <div className="announcements-container container">
          <Alert variant="info">Loading announcements...</Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="announcements-background">
        <Header />
        <div className="announcements-container container">
          <Alert variant="danger">
            {error}
            <div className="mt-3">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

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
            <Button as={Link} to="/announcements/new" className="add-btn">
              Add New
            </Button>
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control w-25"
            />
          </div>

          <div className="announcement-list">
            {filtered.length === 0 ? (
              <p>No announcements found.</p>
            ) : (
              filtered.map((a) => (
                <div
                  key={a.id}
                  className="announcement-card"
                  onClick={() => navigate(`/announcements/${a.id}`)}
                >
                  <div className="announcement-date">
                    {new Date(a.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="announcement-title">{a.title}</div>
                  <div className="announcement-preview">
                    {a.content.slice(0, 100)}...
                  </div>
                  <div className="announcement-posted-by">
                    Posted by: {a.postedBy.email}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Announcements;