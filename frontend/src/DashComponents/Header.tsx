import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css';

interface User {
  profilePic: string;
  username: string;
}

const Header: React.FC = () => {
  const [user] = useState<User | null>({
    profilePic: '/default_profile.jpg', // Default profile picture
    username: 'Manager',
  });

  return (
    <Navbar className="navigationBar" expand="lg">
      <Container>
        {/* Title header refreshes page on click */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="header-title fs-3"
          onClick={() => window.location.reload()}
        >
          Inventory Manager
        </Navbar.Brand>

        <Nav className="ms-auto">
          {/* Increased text size for Home and Inventory */}
          <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
          <Nav.Link as={Link} to="/inventory" className="nav-link-custom">Inventory</Nav.Link>

          {user && (
            <NavDropdown
              className="navDropdown"
              title={
                <img
                  src={user.profilePic}
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-circle profile-img"
                />
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">Account</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;


 /**
  *{useEffect}
  * 
  const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user');
        setUser(response.data); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
*/
