import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, MenuItem, IconButton } from "@mui/material";
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import Header from "../DashComponents/Header";
import '../CSS/Users.css';

// Mock data (replace with Firebase fetch)
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

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Regular" as "Regular" | "Manager" | "Admin",
    profilePicture: "",
    assignedProductTypes: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Fetch user data (replace with Firebase fetch)
    const mockUser: User = {
      id: id || "",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      profilePicture: "https://via.placeholder.com/50",
      createdAt: "2025-01-01",
      updatedAt: "2025-03-01",
      assignedProductTypes: [],
    };
    setUser(mockUser);
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      password: "",
      role: mockUser.role,
      profilePicture: mockUser.profilePicture || "",
      assignedProductTypes: mockUser.assignedProductTypes || [],
    });
  }, [id]);

  const handleSubmit = () => {
    // Update user data (replace with Firebase update)
    console.log("Updated user:", formData);
    navigate("/users");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="edit-user-container">
      <Header />
      <Row>
        <Col>
          <h2>Edit User</h2>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as "Regular" | "Manager" | "Admin" })
            }
            margin="normal"
          >
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Profile Picture URL"
            value={formData.profilePicture}
            onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
            margin="normal"
          />
          {formData.role === "Regular" && (
            <TextField
              fullWidth
              select
              label="Assigned Product Types"
              value={formData.assignedProductTypes}
              onChange={(e) =>
                setFormData({ ...formData, assignedProductTypes: e.target.value as any })
              }
              SelectProps={{ multiple: true }}
              margin="normal"
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
            </TextField>
          )}
          <div className="mt-3">
            <Button variant="secondary" onClick={() => navigate("/users")} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUser;