import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card } from 'react-bootstrap';
import RHeader from "./RHeader";

// Mock Employee Data (in a real app, this would come from an API or context)
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  assignedItemTypes: string[];
}

const initialEmployee: Employee = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'Inventory Manager',
  assignedItemTypes: ['Electronics', 'Groceries'],
};

const RSettings: React.FC = () => {
  const [employee, setEmployee] = useState<Employee>(initialEmployee);

  // Simulate fetching employee data on mount
  useEffect(() => {
    // In a real app, fetch from API: fetch('/api/employee/me').then(res => res.json()).then(data => setEmployee(data))
    setEmployee(initialEmployee);
  }, []);

  return (
    <>
      <RHeader />
      <div className="settings-background">
        <Container>
          <h2 className="my-4">Account Settings - {employee.name}</h2>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Personal Information</Card.Title>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="employeeId" className="mb-3">
                      <Form.Label>Employee ID</Form.Label>
                      <Form.Control type="text" value={employee.id} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="role" className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control type="text" value={employee.role} disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="name" className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" value={employee.name} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" value={employee.email} disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Assigned Item Types</Card.Title>
              <Form>
                <Form.Group controlId="assignedItemTypes" className="mb-3">
                  <Form.Label>Assigned Types</Form.Label>
                  <Form.Control
                    type="text"
                    value={employee.assignedItemTypes.join(', ')}
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