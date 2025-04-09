import React, { useState } from 'react';
import { Button, Form, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Use useNavigate here
import Header from '../DashComponents/Header';
import '../CSS/Announcements.css';

const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const navigate = useNavigate();  // Use useNavigate here

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement = { title, content, category, date: new Date().toLocaleDateString() };
    console.log('New Announcement:', newAnnouncement);
    // Add logic to send the new announcement to the backend here

    // Show success toast
    setShowToast(true);

    // Redirect back to announcements page after showing success message
    setTimeout(() => {
      setShowToast(false);
      navigate('/announcements');
    }, 2000); // Hide toast after 2 seconds and navigate
  };

  return (
<>
    <Header />
    <div className="create-announcement-page">

      <div className="container">
        <h2 className="mb-4">Create New Announcement</h2>

        {/* Back Button */}
        <Button variant="secondary" onClick={() => navigate('/announcements')} className="mb-3">
          Back to Announcements
        </Button>

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
          
          <Form.Group controlId="formCategory" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category (e.g., News, Activities)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

          <Button type="submit" className="mt-4">Create Announcement</Button>
        </Form>

        {/* Success Toast */}
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2000}  // Toast stays for 2 seconds
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
