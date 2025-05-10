// frontend/src/DashComponents/MSettings.tsx
import Header from '@/DashComponents/Header';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentEmployee, updateEmployee } from '../../services/api'; // Import from api.ts
import "../CSS/MSettings.css";
import { useTranslation } from "react-i18next";

interface Settings {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Regular' | 'Manager';
  avatar?: string;
  assignedProductTypes?: string[];
}

const MSettings: React.FC = () => {
    const { t } = useTranslation();
  
  const [settings, setSettings] = useState<Settings>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'Manager',
    avatar: '',
    assignedProductTypes: [],
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = await getCurrentEmployee();
        setSettings({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.profilePicture || '',
          assignedProductTypes: user.assignedProductTypes || [],
        });
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes('Session expired')) {
          navigate('/login');
        }
      }
    };
    fetchSettings();
  }, [navigate]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('settings', JSON.stringify({
        firstName: settings.firstName,
        lastName: settings.lastName,
        email: settings.email,
        role: settings.role,
        profileImageUrl: settings.avatar,
        assignedProductTypes: settings.assignedProductTypes,
      }));
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await updateEmployee(settings.id, {
        firstName: settings.firstName,
        lastName: settings.lastName,
        email: settings.email,
        role: settings.role,
        profileImageUrl: avatarFile ? undefined : settings.avatar,
        assignedProductTypes: settings.assignedProductTypes,
      });

      setIsEditMode(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/manager-dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
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
              {error && <div className="alert alert-danger">{error}</div>}
              {/* Profile Section */}
              <div className="profile-container">
                {/* Avatar Section */}
                <div className="avatar-section">
                  <div className="avatar-wrapper">
                    {settings.avatar ? (
                      <img src={settings.avatar} alt="Avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">{t("MS.No Avatar")}</div>
                    )}
                    {isEditMode && (
                      <>
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
                        {settings.avatar && (
                          <Button variant="danger" size="sm" onClick={handleAvatarDelete}>
                            {t("MS.Delete Avatar")}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="profile-info">
                  <p>
                    {t("MS.Name:")}{' '}
                    {isEditMode ? (
                      <Form.Control
                        type="text"
                        value={settings.firstName}
                        onChange={e => setSettings({ ...settings, firstName: e.target.value })}
                      />
                    ) : (
                      settings.firstName || 'N/A'
                    )}
                  </p>
                  <p>
                    {t("MS.Surname:")}{' '}
                    {isEditMode ? (
                      <Form.Control
                        type="text"
                        value={settings.lastName}
                        onChange={e => setSettings({ ...settings, lastName: e.target.value })}
                      />
                    ) : (
                      settings.lastName || 'N/A'
                    )}
                  </p>
                  <p>
                    {t("MS.Email:")}{' '}
                    {isEditMode ? (
                      <Form.Control
                        type="email"
                        value={settings.email}
                        onChange={e => setSettings({ ...settings, email: e.target.value })}
                      />
                    ) : (
                      settings.email || 'N/A'
                    )}
                  </p>
                  <p>{t("MS.ID:")} {settings.id || 'N/A'}</p>
                  <p>{t("Musers.Role:")} {settings.role || 'N/A'}</p>
                  {settings.assignedProductTypes && settings.assignedProductTypes.length > 0 && (
                    <p>
                      {t("Musers.Assigned Product Types:")}{' '}
                      {settings.assignedProductTypes.join(', ') || 'None'}
                    </p>
                  )}
                </div>
              </div>
{/** 
              <div className="edit-button-wrapper">
                <Button variant="primary" onClick={toggleEditMode}>
                  {isEditMode ? 'Cancel' : 'Edit Profile'}
                </Button>
                {isEditMode && (
                  <Button variant="success" onClick={handleSubmit} className="ms-2">
                    {t("MS.Save Changes")}
                  </Button>
                )}
              </div>
*/}
            </div>
          </Row>
        </Container>

        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
          <Modal.Body className="text-center">
            <h4>{t("MS.Success!")}</h4>
            <p>{t("MS.Your changes have been saved successfully.")}</p>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default MSettings;