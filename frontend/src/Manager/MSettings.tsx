import Header from "@/DashComponents/Header";
import React, { useEffect, useState } from "react";
import { Form, Button, Row, Container, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/MSettings.css";
import { getCurrentUser, User } from "../../services/api";

interface Settings {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role: string;
  businessName: string;
  avatar?: string;
}

const MSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    role: "",
    businessName: "",
    avatar: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        // Extract business name from email (e.g., alice@company.com -> company)
        const businessName = user.email.split("@")[1]?.split(".")[0] || "";

        setSettings({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user.id,
          role: user.role,
          businessName: businessName,
          avatar: user.profilePicture || "",
        });
      } catch (err: any) {
        console.error("Failed to fetch user data:", err);
        setError(err.message || "Failed to load user data");
      }
    };
    fetchUserData();
  }, []);

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

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
                      <img
                        src={settings.avatar}
                        alt="Avatar"
                        className="avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">No Avatar</div>
                    )}
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="profile-info">
                  <p>Name: {settings.firstName}</p>
                  <p>Surname: {settings.lastName}</p>
                  <p>Email: {settings.email}</p>
                  <p>ID: {settings.id}</p>
                  <p>Role: {settings.role}</p>
                  <p>Business Name: {settings.businessName}</p>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MSettings;
