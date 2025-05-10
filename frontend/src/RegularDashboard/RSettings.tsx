import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RHeader from './RHeader';
import { useTranslation } from "react-i18next";
import { getCurrentEmployee, User } from '../../services/api';

const RSettings: React.FC = () => {
  const { t } = useTranslation();
  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // fetch employee data on mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentEmployee();
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load account settings.');
        if (err.message.includes('Session expired')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="settings-background">
        <RHeader />
        <Container className="mt-5">
          <Alert variant="info">Loading account settings...</Alert>
        </Container>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="settings-background">
        <RHeader />
        <Container className="mt-5">
          <Alert variant="danger">
            {error || 'Unable to load employee data. Please try again.'}
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

  // Combine firstName and lastName for display
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <>
      <RHeader />
      <div className="settings-background">
        <Container>
          <h2 className="my-4">{t("RSettings.Account Settings")} - {fullName}</h2>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{t("RSettings.Personal Information")}</Card.Title>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="employeeId" className="mb-3">
                      <Form.Label>{t("RSettings.Employee ID")}</Form.Label>
                      <Form.Control type="text" value={employee.id} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="role" className="mb-3">
                      <Form.Label>{t("RSettings.Role")}</Form.Label>
                      <Form.Control type="text" value={employee.role} disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="name" className="mb-3">
                      <Form.Label>{t("RSettings.Name")}</Form.Label>
                      <Form.Control type="text" value={fullName} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>{t("RSettings.Email")}</Form.Label>
                      <Form.Control type="email" value={employee.email} disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{t("RSettings.Assigned Item Types")}</Card.Title>
              <Form>
                <Form.Group controlId="assignedItemTypes" className="mb-3">
                  <Form.Label>{t("RSettings.Assigned Types")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={employee.assignedProductTypes?.join(', ') || 'None'}
                    disabled
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default RSettings;