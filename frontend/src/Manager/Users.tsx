import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { Modal, Box, Typography, TextField, MenuItem, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import Header from '../DashComponents/Header';
import { getEmployees, createEmployee, deleteEmployee, getProductTypes } from "../../services/api";
import '../CSS/Users.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Regular' | 'Manager';
  profilePicture?: string;
  assignedProductTypes?: string[];
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'firstName' | 'role' | 'assignedProductTypes'>('firstName');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Regular' as 'Regular' | 'Manager',
    assignedProductTypes: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const employees = await getEmployees();
        setUsers(employees);
        setFilteredUsers(employees);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === 'firstName') {
        return a.firstName.localeCompare(b.firstName);
      } else if (sortBy === 'role') {
        return a.role.localeCompare(b.role);
      } else if (sortBy === 'assignedProductTypes') {
        const aTypes = a.assignedProductTypes?.join(', ') || '';
        const bTypes = b.assignedProductTypes?.join(', ') || '';
        return aTypes.localeCompare(bTypes);
      }
      return 0;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, sortBy, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddUser = async () => {
    try {
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
        alert('All fields are required');
        return;
      }
      if (newUser.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
  
      const payload = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        profileImageUrl: newUser.profileImageUrl || undefined,
        assignedTypes: newUser.role === 'Regular' ? newUser.assignedProductTypes : [],
      };
      console.log('Payload to create employee:', payload); // Debug log
  
      const newUserData = await createEmployee(payload);
      console.log('Response from backend:', newUserData); // Debug log
  
      setUsers([...users, newUserData]);
      setFilteredUsers([...users, newUserData]);
      setShowAddModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Regular',
        assignedProductTypes: [],
      });
    } catch (err: any) {
      console.error('Error creating user:', err);
      alert(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteEmployee(userToDelete);
        setUsers(users.filter((user) => user.id !== userToDelete));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userToDelete));
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (err: any) {
        console.error('Error deleting user:', err);
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

const [productTypes, setProductTypes] = useState<string[]>([]);

useEffect(() => {
  const fetchProductTypes = async () => {
    try {
      const types = await getProductTypes();
      setProductTypes(types);
    } catch (err: any) {
      console.error('Failed to fetch product types:', err);
    }
  };
  fetchProductTypes();
}, []);

  return (
    <>
      <Header />
      <Container className="users-container">
        {/* Filter and Add */}
        <Row className="AddUserfilter-section">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'firstName' | 'role' | 'assignedProductTypes')}
            >
              <option value="firstName">Sort by Name</option>
              <option value="role">Sort by Role</option>
              <option value="assignedProductTypes">Sort by Assigned Types</option>
            </Form.Select>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Add /> Add New User
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Row>
          <Col>
            <Table striped bordered hover responsive className="UserListtable">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assigned Product Types</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <img src={user.profilePicture} alt={user.firstName} className="Usersprofile-picture" />
                      </td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.assignedProductTypes?.join(', ') || '-'}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}`)}
                          className="me-2"
                        >
                          <Visibility /> View
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => navigate(`/users/edit/${user.id}`)}
                          className="me-2"
                        >
                          <Edit /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setUserToDelete(user.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Delete /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Pagination */}
        <Row>
          <Col className="text-center">
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>

        {/* Add User Modal */}
        <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
          <Box className="Users-modal-box">
            <Typography variant="h6" mb={3}>
              Add New User
            </Typography>

            <TextField
              fullWidth
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'Regular' | 'Manager' })}
              margin="normal"
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </TextField>

            {newUser.role === 'Regular' && (
              <TextField
                fullWidth
                select
                label="Assigned Product Types"
                value={newUser.assignedProductTypes}
                onChange={(e) => setNewUser({ ...newUser, assignedProductTypes: e.target.value as string[] })}                SelectProps={{ multiple: true }}
                margin="normal"
              >
                {productTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="secondary" onClick={() => setShowAddModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddUser}>
                Add User
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation */}
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <Box className="Users-modal-box">
            <Typography variant="h6" mb={3}>
              Confirm Deletion
            </Typography>
            <Typography mb={3}>Are you sure you want to delete this user?</Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Users;