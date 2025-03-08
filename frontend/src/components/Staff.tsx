import React, { useState } from "react";
import { Tab, Tabs, Table, Button, Form } from "react-bootstrap";
import "./Staff.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const staffData = [
  { name: "Afagh Izadi Dakhrabadi", ID: "1", changes: 1, contact: 5511487649 },
  { name: "Imran Durmus", ID: "2", changes: 4, contact: 2385073529 },
  { name: "Oussema Tanfouri", ID: "3", changes: 5, contact: 5362654328 },
  { name: "Jihad Khouly", ID: "4", changes: 0, contact: 7744254554 },
  { name: "Filler P.", ID: "5", changes: 1, contact: 5511487649 },
  { name: "Jane Liz", ID: "6", changes: 4, contact: 23356073529 },
  { name: "Amy Touri", ID: "7", changes: 5, contact: 9988577632 },
  { name: "Liz King", ID: "8", changes: 1, contact: 83012353426 },
  { name: "YMCA ID.", ID: "9", changes: 4, contact: 23356073529 },
  { name: "Robert Downy Jr.", ID: "10", changes: 80, contact: 9988577632 },
  { name: "Fan Cameron", ID: "11", changes: 0, contact: 83012353426 },
];

const Staff: React.FC = () => {
  const [staff, setStaff] = useState(staffData);
  const [searchQuery, setSearchQuery] = useState(""); // State to track the search query
  const [newEmployee, setNewEmployee] = useState({ name: "", contact: "" });

  const handleAddEmployee = () => {
    const newStaffMember = {
      ...newEmployee,
      ID: (staff.length + 1).toString(),
      changes: 0,
    };
    setStaff([...staff, newStaffMember]);
    setNewEmployee({ name: "", contact: "" }); // resets the form
  };

  // Filter staff based on the search query
  const filteredStaff = staff.filter((staffMember) =>
    staffMember.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="staff-page">
      <h1 className="Staff-Title">Staff Dashboard</h1>

      {/* Tabs component */}
      <Tabs defaultActiveKey="staff" id="management-tabs" className="mb-3">
        
        {/* Staff List Tab */}
        <Tab eventKey="staff" title="Staff List">
          <Form.Control
            type="text"
            placeholder="Search for an employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input mb-3"
          />

          <Table striped bordered hover id="staff-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>ID</th>
                <th>Changes</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff, index) => (
                <tr key={index}>
                  <td>{staff.name}</td>
                  <td>{staff.ID}</td>
                  <td>{staff.changes}</td>
                  <td>{staff.contact}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Add Employee Tab */}
        <Tab eventKey="addEmployee" title="Add Employee">
          <div className="add-employee-form">
            <h3>Add New Employee</h3>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="formContact">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact number"
                  value={newEmployee.contact}
                  onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </Form>
          </div>
        </Tab>

        {/* Requests Tab */}
        <Tab eventKey="requests" title="Changes">
          <div className="requests-list">
            <h3>Staff Changes</h3>
            <Table striped bordered hover id="requests-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Changes Made</th>
                </tr>
              </thead>
              <tbody>
                {staff.filter(staff => staff.changes > 0).map((staff, index) => (
                  <tr key={index}>
                    <td>{staff.name}</td>
                    <td>{staff.changes} changes</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

      </Tabs>
    </div>
  );
};

export default Staff;
