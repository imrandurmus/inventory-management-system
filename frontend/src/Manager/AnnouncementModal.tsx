import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

interface Announcement {
  id: number;
  title: string;
  date: string;
  read: boolean;
  content: string;
}

const AnnouncementModal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulating data, replace with actual data fetching or state management
  const announcements: Announcement[] = [
    {
      id: 1,
      title: 'New Product Launch 🚀',
      date: '2025-04-01',
      read: false,
      content: 'We are excited to announce the launch of our brand-new product line. Join the kickoff event next Monday!',
    },
    {
      id: 2,
      title: 'Team Building Activity 🏞️',
      date: '2025-03-28',
      read: true,
      content: 'Don’t forget the team-building retreat this weekend at Lakeview Park. Lunch and games provided!',
    },
  ];

  const announcement = announcements.find(a => a.id.toString() === id);

  if (!announcement) return <div>Announcement not found</div>;

  return (
    <Modal show={true} onHide={() => navigate('/announcements')}>
      <Modal.Header closeButton>
        <Modal.Title>{announcement.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="announcement-date">
          {new Date(announcement.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </div>
        <p>{announcement.content}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => navigate('/announcements')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnnouncementModal;
