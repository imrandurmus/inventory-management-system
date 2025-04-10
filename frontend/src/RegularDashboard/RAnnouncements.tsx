import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Modal, Button, Pagination } from 'react-bootstrap';
import '../CSS/RAnnouncements.css';
import RHeader from './RHeader';

// Define the Announcement interface
interface Announcement {
  id: number;
  title: string;
  date: string;
  read: boolean;
  content: string;
  category: string;
}

const RAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Reduced to ensure cards fit within viewport

  useEffect(() => {
    // MOCK DATA for now, remove later when integrating with backend
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
      {
        id: 4,
        title: 'Office Renovation Update 🏢',
        date: '2025-03-15',
        read: true,
        content: 'The office renovation is on schedule. New meeting rooms will be available next month.',
        category: 'News',
      },
      {
        id: 5,
        title: 'Holiday Party 🎉',
        date: '2025-03-10',
        read: false,
        content: 'Join us for the annual holiday party on December 20th at the Grand Hotel!',
        category: 'Activities',
      },
      {
        id: 6,
        title: 'New HR Policy 📜',
        date: '2025-03-05',
        read: true,
        content: 'A new HR policy has been implemented regarding remote work. Please review the details.',
        category: 'News',
      },
    ];

    setAnnouncements(mockAnnouncements);
  }, []);

  // Filter announcements based on unread status, category, and search query
  const filtered = announcements
    .filter((a) => (filterUnread ? !a.read : true))
    .filter((a) => (activeTab === 'All' ? true : a.category === activeTab))
    .filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = filtered.slice(startIndex, endIndex);

  // Handle clicking an announcement to show the modal
  const handleShowModal = (announcement: Announcement) => {
    if (!announcement.read) {
      fetch(`/api/announcements/${announcement.id}/mark-as-read`, {
        method: 'PATCH',
        credentials: 'include',
      })
        .then(() => {
          setAnnouncements((prev) =>
            prev.map((ann) =>
              ann.id === announcement.id ? { ...ann, read: true } : ann
            )
          );
        })
        .catch((err) => console.error('Failed to mark as read:', err));
    }
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
  };

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
              <Form.Check
                type="checkbox"
                label="Show Unread Only"
                checked={filterUnread}
                onChange={(e) => {
                  setFilterUnread(e.target.checked);
                  setCurrentPage(1); // Reset to first page
                }}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value);
                  setCurrentPage(1); // Reset to first page
                }}
              >
                <option value="All">All Categories</option>
                <option value="News">News</option>
                <option value="Activities">Activities</option>
              </Form.Control>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page
                }}
              />
            </Col>
          </Row>

          {/* Announcement List */}
          <div className="rannouncement-list">
            {currentAnnouncements.length === 0 ? (
              <p>No announcements found.</p>
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
                    {a.content.slice(0, 100)}...
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