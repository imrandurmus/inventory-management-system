// frontend/src/Manager/CreateAnnouncement.tsx
import React, { useState } from 'react';
import { Button, Form, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../DashComponents/Header';
import { createAnnouncement } from '../../services/api';
import '../CSS/Announcements.css';

const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createAnnouncement({ title, content });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/announcements');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create announcement.');
    }
  };

  return (
    <>
      <Header />
      <div className="create-announcement-page">
        <div className="container">
          <h2 className="mb-4">Create New Announcement</h2>

          <Button variant="secondary" onClick={() => navigate('/announcements')} className="mb-3">
            Back to Announcements
          </Button>

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter announcement content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="mt-4">
              Create Announcement
            </Button>
          </Form>

          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={2000}
            autohide
            className="mt-4"
          >
            <Toast.Body>Announcement Created Successfully!</Toast.Body>
          </Toast>
        </div>
      </div>
    </>
  );
};

export default CreateAnnouncement;