import Header from '@/DashComponents/Header';
import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Row, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../CSS/MSettings.css";

interface Settings {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  id: string;
  role: string;          // Added role
  businessName: string;  // Added business name
  address: string;
  avatar?: string;
}

const MSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    id: '',
    role: '',
    businessName: '',
    address: '',
    avatar: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // Track edit mode state
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false); // Success modal state
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to fetch settings', err));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSettings({ ...settings, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarDelete = () => {
    setAvatarFile(null);
    setSettings({ ...settings, avatar: '' });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('settings', JSON.stringify(settings));
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    fetch('/api/settings', {
      method: 'PUT',
      body: formData,
    })
      .then(res => res.json())
      .then(() => {
        setIsEditMode(false); // Disable edit mode after saving
        setShowSuccessModal(true); // Show success modal
        setTimeout(() => {
          setShowSuccessModal(false); // Hide modal after a short period
          navigate('/manager-dashboard');
        }, 2000); // Close modal after 2 seconds
      })
      .catch(err => console.error('Failed to update settings', err));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <>
    <Header />
    <div className="Msettings-wrapper">
      <Container fluid className="Msettings-container">
        <Row className="justify-content-center">
          <div className="main-content">
            {/* Profile Section */}
            <div className="profile-container">
              {/* Avatar Section */}
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  {settings.avatar ? (
                    <img src={settings.avatar} alt="Avatar" className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">No Avatar</div>
                  )}
                  <label htmlFor="avatar-upload" className="avatar-upload-btn">
                    <i className="bi bi-camera"></i>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="profile-info">
                <p>Name: {isEditMode ? (
                  <Form.Control
                    type="text"
                    value={settings.firstName}
                    onChange={e => setSettings({ ...settings, firstName: e.target.value })}
                  />
                ) : (
                  settings.firstName
                )}</p>

                <p>Surname: {isEditMode ? (
                  <Form.Control
                    type="text"
                    value={settings.lastName}
                    onChange={e => setSettings({ ...settings, lastName: e.target.value })}
                  />
                ) : (
                  settings.lastName
                )}</p>

                <p>Email: {isEditMode ? (
                  <Form.Control
                    type="email"
                    value={settings.email}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                  />
                ) : (
                  settings.email
                )}</p>

                <p>Phone Number: {isEditMode ? (
                  <Form.Control
                    type="text"
                    value={settings.phoneNumber}
                    onChange={e => setSettings({ ...settings, phoneNumber: e.target.value })}
                  />
                ) : (
                  settings.phoneNumber
                )}</p>

                <p>ID: {settings.id}</p>
                <p>Role: {settings.role}</p>
                <p>Business Name: {settings.businessName}</p>
                <p>Address: {isEditMode ? (
                  <Form.Control
                    type="text"
                    value={settings.address}
                    onChange={e => setSettings({ ...settings, address: e.target.value })}
                  />
                ) : (
                  settings.address
                )}</p>
              </div>
            </div>

            <div className="edit-button-wrapper">
              <Button variant="primary" onClick={toggleEditMode}>
                {isEditMode ? 'Cancel' : 'Edit Profile'}
              </Button>

              {isEditMode && (
                <Button variant="success" onClick={handleSubmit} className="ms-2">
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </Row>
        
      </Container>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body className="text-center">
          <h4>Success!</h4>
          <p>Your changes have been saved successfully.</p>
        </Modal.Body>
      </Modal>
    </div>
    </>
  );
};

export default MSettings;
