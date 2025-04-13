import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Modal, Button, Pagination, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/RAnnouncements.css';
import RHeader from './RHeader';
import { getAnnouncements, getUnreadAnnouncements, markAnnouncementAsRead, Announcement as BackendAnnouncement } from '../../services/api';

// Define the Announcement interface
interface Announcement {
  id: string;
  title: string;
  date: string;
  read: boolean;
  content: string;
  category: string;
}

const RAnnouncements: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all announcements
        const allAnnouncements = await getAnnouncements();
        console.log('Fetched all announcements:', allAnnouncements);

        // Fetch unread announcements
        const unreadAnnouncements = await getUnreadAnnouncements();
        const unreadIds = new Set(unreadAnnouncements.map((ann) => ann.id));
        console.log('Unread announcement IDs:', Array.from(unreadIds));

        // Map backend data to local interface
        const mappedAnnouncements: Announcement[] = allAnnouncements.map((ann: BackendAnnouncement) => ({
          id: ann.id,
          title: ann.title,
          date: new Date(ann.createdAt).toISOString().split('T')[0],
          read: !unreadIds.has(ann.id),
          content: ann.content,
          category: 'News',
        }));

        console.log('Mapped announcements:', mappedAnnouncements);
        setAnnouncements(mappedAnnouncements);

        // Handle single announcement view
        if (id) {
          const announcement = mappedAnnouncements.find((ann) => ann.id === id);
          console.log('Looking for announcement with ID:', id, 'Found:', announcement);
          if (announcement) {
            if (!announcement.read) {
              await markAnnouncementAsRead(id);
              setAnnouncements((prev) =>
                prev.map((ann) => (ann.id === id ? { ...ann, read: true } : ann))
              );
            }
            setSelectedAnnouncement(announcement);
            setShowModal(true);
          } else {
            setError('Announcement not found');
            setShowModal(false);
          }
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load announcements');
        if (err.message.includes('Session expired')) {
          navigate('/Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [id, navigate]);

  // Filter announcements
  const filtered = announcements
    .filter((a) => (filterUnread ? !a.read : true))
    .filter((a) => (activeTab === 'All' ? true : a.category === activeTab))
    .filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  console.log('Filtered announcements:', filtered);

  // Pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = filtered.slice(startIndex, endIndex);
  console.log('Current announcements:', currentAnnouncements);

  // Handle clicking an announcement to show the modal
  const handleShowModal = async (announcement: Announcement) => {
    try {
      if (!announcement.read) {
        await markAnnouncementAsRead(announcement.id);
        setAnnouncements((prev) =>
          prev.map((ann) =>
            ann.id === announcement.id ? { ...ann, read: true } : ann
          )
        );
      }
      setSelectedAnnouncement(announcement);
      setShowModal(true);
      navigate(`/My-Announcements/${announcement.id}`, { replace: true });
    } catch (err) {
      console.error('Failed to mark as read:', err);
      setSelectedAnnouncement(announcement);
      setShowModal(true);
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
    navigate('/My-Announcements', { replace: true });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  if (loading) {
    return (
      <div className="rannouncements-background">
        <RHeader />
        <Container className="mt-5">
          <Alert variant="info">Loading announcements...</Alert>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rannouncements-background">
        <RHeader />
        <Container className="mt-5">
          <Alert variant="danger">
            {error}
            <div className="mt-3">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>{' '}
              <Button variant="secondary" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <>
      <RHeader />
      <div className="rannouncements-background">
        <div className="rannouncements-header d-flex align-items-center mb-4 px-4">
          <img
            className="rannouncements-icon"
            src="/AnnounementsMegaphone.png"
            alt="Announcements Icon"
          />
          <h2 className="rannouncements-title ms-3 mb-0">Announcements</h2>
        </div>

        <Container className="rannouncements-container">
          {/* Filters and Search */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group controlId="filterUnread">
                <Form.Check
                  type="checkbox"
                  label="Show Unread Only"
                  checked={filterUnread}
                  onChange={(e) => {
                    setFilterUnread(e.target.checked);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="categorySelect">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="News">News</option>
                  <option value="Activities">Activities</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="searchQuery">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Announcement List */}
          <div className="rannouncement-list">
            {announcements.length === 0 ? (
              <p>No announcements available.</p>
            ) : currentAnnouncements.length === 0 ? (
              <p>No announcements match your filters.</p>
            ) : (
              currentAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="rannouncement-card"
                  onClick={() => handleShowModal(a)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleShowModal(a);
                    }
                  }}
                >
                  <div className="rannouncement-date">
                    {new Date(a.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                  <div className={`rannouncement-title ${!a.read ? 'unread' : ''}`}>
                    {a.title}
                  </div>
                  <div className="rannouncement-preview">
                    {a.content.length > 100 ? `${a.content.slice(0, 100)}...` : a.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </Container>

        {/* Modal for Announcement Details */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedAnnouncement?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Date:</strong>{' '}
              {selectedAnnouncement &&
                new Date(selectedAnnouncement.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
            </p>
            <p>{selectedAnnouncement?.content}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default RAnnouncements;