import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Visibility, Add } from "@mui/icons-material";
import { Modal, Box, Typography, TextField, MenuItem, IconButton } from "@mui/material";
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage imports
//import { storage } from "./firebaseConfig"; // Import Firebase Storage
import Header from "../CSS/Header.css";
import "../CSS/Users.css";

// Mock data (replace with Firebase or API call)
interface User {
  id: string;
  name: string;
  email: string;
  role: "Regular" | "Manager" | "Admin";
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  assignedProductTypes?: string[];
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "role">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Regular" as "Regular" | "Manager" | "Admin",
    profilePicture: "",
    profilePictureFile: null as File | null, // Add file field for upload
    assignedProductTypes: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);

  // Mock data (replace with Firebase fetch)
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-01-01",
        updatedAt: "2025-03-01",
        assignedProductTypes: [],
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      {
        id: "3",
        name: "added Smith",
        email: "add.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      {
        id: "4",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      {
        id: "5",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      {
        id: "6",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      {
        id: "7",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      {
        id: "8",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/50",
        createdAt: "2025-02-01",
        updatedAt: "2025-03-15",
        assignedProductTypes: ["Electronics", "Furniture"],
      },
      
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Search and Sort
  useEffect(() => {
    let filtered = [...users];
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return a.role.localeCompare(b.role);
      }
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, sortBy, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle file change for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewUser({ ...newUser, profilePictureFile: e.target.files[0] });
    }
  };

  // Add User with Firebase Storage upload
  const handleAddUser = async () => {
    let profilePictureUrl = "https://via.placeholder.com/50"; // Default placeholder

    // Upload profile picture to Firebase Storage if a file is selected
    if (newUser.profilePictureFile) {
      try {
        const storageRef = ref(storage, `profile-pictures/${newUser.email}-${newUser.profilePictureFile.name}`);
        await uploadBytes(storageRef, newUser.profilePictureFile);
        profilePictureUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Using default image.");
      }
    }

    const newUserData: User = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      profilePicture: profilePictureUrl,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      assignedProductTypes: newUser.role === "Regular" ? newUser.assignedProductTypes : [],
    };

    setUsers([...users, newUserData]);
    setFilteredUsers([...users, newUserData]);
    setShowAddModal(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "Regular",
      profilePicture: "",
      profilePictureFile: null,
      assignedProductTypes: [],
    });
  };

  // Delete User
  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <Container className="users-container">
      <Header />

      {/* Filter and Add User Section */}
      <Row className="AddUserfilter-section">
        <Col md={4} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={4} className="mb-3">
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "role")}>
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
          </Form.Select>
        </Col>
        <Col md={4} className="mb-3 text-end">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Add /> Add New User
          </Button>
        </Col>
      </Row>

      {/* User List Table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive className="UserListtable">
            <thead>
              <tr>
                <th>Profile Picture</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img src={user.profilePicture} alt={user.name} className="Usersprofile-picture" />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <Visibility /> View
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/users/edit/${user.id}`)}
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
                  <td colSpan={5} className="text-center">
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
            label="Name and Surname"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
            type={showPassword ? "text" : "password"}
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
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value as "Regular" | "Manager" | "Admin" })
            }
            margin="normal"
          >
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <Form.Group controlId="profilePicture" className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {newUser.profilePictureFile && (
              <img
                src={URL.createObjectURL(newUser.profilePictureFile)}
                alt="Preview"
                className="User-profile-picture-preview"
              />
            )}
          </Form.Group>
          {newUser.role === "Regular" && (
            <TextField
              fullWidth
              select
              label="Assigned Product Types"
              value={newUser.assignedProductTypes}
              onChange={(e) =>
                setNewUser({ ...newUser, assignedProductTypes: e.target.value as any })
              }
              SelectProps={{ multiple: true }}
              margin="normal"
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
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

      {/* Delete Confirmation Modal */}
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
  );
};

export default Users;