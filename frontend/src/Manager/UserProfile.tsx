import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
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

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const currentUserRole = "Admin"; // Replace with actual role from auth context

  useEffect(() => {
    // Mock data (same as in Users.tsx, replace with Firebase fetch)
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        profilePicture: "https://via.placeholder.com/150",
        createdAt: "2025-01-01",
        updatedAt: "2025-03-01",
        assignedProductTypes: [],
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Regular",
        profilePicture: "https://via.placeholder.com/150",
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

    // Find the user with the matching id
    const foundUser = mockUsers.find((user) => user.id === id);
    if (foundUser) {
      setUser(foundUser);
    } else {
      setUser(null); // Handle case where user is not found
    }
  }, [id]);

  if (!user) {
    return <div>User not found</div>;
  }

  const canEdit = currentUserRole === "Admin" || currentUserRole === "Manager";
  const isOwnProfile = true; // Replace with actual check (e.g., user.id === currentUser.id)

  return (
    <Container className="user-detail-container">
      <Header />
      <Row className="mb-3">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/users")}
            className="back-button"
          >
            <ArrowBack /> Back to Users
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="text-center">
          <img src={user.profilePicture} alt={user.name} className="profile-picture-large" />
        </Col>
        <Col md={8}>
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Created At:</strong> {user.createdAt}</p>
          <p><strong>Updated At:</strong> {user.updatedAt}</p>
          {user.role === "Regular" && user.assignedProductTypes && (
            <p><strong>Assigned Product Types:</strong> {user.assignedProductTypes.join(", ")}</p>
          )}
          <div className="mt-3">
            {canEdit && (
              <>
                <Button
                  variant="outline-warning"
                  className="me-2"
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  <Edit /> Edit
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => navigate("/users")} // Add delete logic if needed
                >
                  <Delete /> Delete
                </Button>
              </>
            )}
            {isOwnProfile && !canEdit && <p>You can only view your own profile.</p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;