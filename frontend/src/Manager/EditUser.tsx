import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, MenuItem, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import Header from '../DashComponents/Header';
import { User, getEmployeeById, updateEmployee, getProductTypes } from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import '../CSS/Users.css';

interface JwtPayload {
  sub: string; // Email of the current user
  role: string; // Role claim (e.g., "MANAGER" or "REGULAR")
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Regular' as 'Regular' | 'Manager',
    profileImageUrl: '',
    assignedProductTypes: [] as string[],
  });
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfileRestricted, setIsOwnProfileRestricted] = useState(false);

  useEffect(() => {
    const fetchUserAndProductTypes = async () => {
      if (!id) {
        setError('No user ID provided');
        return;
      }
      try {
        const fetchedUser = await getEmployeeById(id);
        setUser(fetchedUser);
        setFormData({
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          email: fetchedUser.email,
          password: '',
          role: fetchedUser.role,
          profileImageUrl: fetchedUser.profilePicture || '',
          assignedProductTypes: fetchedUser.assignedProductTypes || [],
        });

        const types = await getProductTypes();
        setProductTypes(types);

        // Check if this is the logged-in user's profile and apply restriction
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: JwtPayload = jwtDecode(token);
          const isOwnProfile = decoded.sub === fetchedUser.email;
          const isManager = decoded.role === 'MANAGER';
          // Restrict only if it's the user's own profile and they are not a manager
          setIsOwnProfileRestricted(isOwnProfile && !isManager);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user or product types');
      }
    };
    fetchUserAndProductTypes();
  }, [id]);

  const handleSubmit = async () => {
    if (isOwnProfileRestricted) {
      alert('You cannot edit your own credentials as a regular user');
      return;
    }
    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        alert('First Name, Last Name, and Email are required');
        return;
      }
      await updateEmployee(id!, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password || undefined,
        role: formData.role,
        profileImageUrl: formData.profileImageUrl || undefined,
        assignedProductTypes: formData.role === 'Regular' ? formData.assignedProductTypes : [],
      });
      navigate('/users');
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Container className="edit-user-container">
        <Row>
          <Col>
            <h2>Edit User</h2>
            {isOwnProfileRestricted && (
              <p style={{ color: 'red' }}>You cannot edit your own credentials.</p>
            )}
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              margin="normal"
              disabled={isOwnProfileRestricted}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              margin="normal"
              disabled={isOwnProfileRestricted}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              disabled={isOwnProfileRestricted}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
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
              placeholder="Leave blank to keep unchanged"
              disabled={isOwnProfileRestricted}
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Regular' | 'Manager' })}
              margin="normal"
              disabled={isOwnProfileRestricted}
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Profile Picture URL"
              value={formData.profileImageUrl}
              onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
              margin="normal"
              placeholder="Optional: Leave blank for default avatar"
              disabled={isOwnProfileRestricted}
            />
            {formData.role === 'Regular' && (
              <TextField
              fullWidth
              select
              label="Assigned Product Types"
              value={formData.assignedProductTypes}
              onChange={(e) => setFormData({ ...formData, assignedProductTypes: e.target.value as string[] })}
              SelectProps={{ multiple: true }}
              margin="normal"
              disabled={isOwnProfileRestricted}
                >              
                {productTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <div className="mt-3">
              <Button variant="secondary" onClick={() => navigate('/users')} className="me-2">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isOwnProfileRestricted}
              >
                Save Changes
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditUser;