import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import Header from '../DashComponents/Header';
import { User, getEmployeeById } from "../../services/api";
import '../CSS/Users.css';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentUserRole = 'Manager'; // Replace with actual role from auth context (e.g., JWT claim)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('No user ID provided');
        return;
      }
      try {
        const fetchedUser = await getEmployeeById(id);
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user');
      }
    };
    fetchUser();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const canEdit = currentUserRole === 'Manager'; // Adjust based on actual roles
  const isOwnProfile = false; // Replace with actual check (e.g., user.id === currentUser.id from JWT)

  return (
    <>
      <Header />
      <Container className="user-detail-container">
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/users')}
              className="back-button"
            >
              <ArrowBack /> Back to Users
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="text-center">
            <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} className="profile-picture-large" />
          </Col>
          <Col md={8}>
            <h2>{`${user.firstName} ${user.lastName}`}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.role === 'Regular' && user.assignedProductTypes && (
              <p><strong>Assigned Product Types:</strong> {user.assignedProductTypes.join(', ') || 'None'}</p>
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
                    onClick={() => navigate('/users')} // TODO: Implement delete logic
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
    </>
  );
};

export default UserProfile;