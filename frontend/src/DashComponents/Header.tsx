import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bell, Mail, Sun, Settings } from 'lucide-react';
import "../CSS/Header.css";

interface User {
  username: string;
  profilePic: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user/me', {
      credentials: 'include', // Include cookies/session if needed
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Failed to fetch user', err));
  }, []);

  return (
    <Navbar className="navigationBarr" expand="lg" fixed="top">
      <Container fluid className="d-flex align-items-center">
        {/* Middle Navigation */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
{/**  Static name below for now, delete when backend */}
          <p className="nav-link-custom ml-2 mr-6 mt-2">Hello, User</p>
{/**  Static name below for now, delete when backend */}

{/**      The backend code for getting username, uncomment when needed
            {user ? (
              <p className="nav-link-custom fw-bold ml-2 mr-6 mt-2">Hello, {user.username}</p>
            ) : (
              <p className="nav-link-custom fw-bold ml-2 mr-6 mt-2">Hello</p>
            )}
            <Nav.Link onClick={() => window.location.reload()} className="nav-link-custom fw-bold">
  Home
</Nav.Link>
*/}
            <Nav.Link as={Link} to="/User-Dashboard" className="nav-link-custom">Dashboard</Nav.Link>
            <NavDropdown title="Items" className="nav-link-custom" id="items-dropdown">
              <NavDropdown.Item as={Link} to="/items/products">Products</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/items/orders">Orders</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/items/invoices">Invoices</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/Reports" className="nav-link-custom">Reports</Nav.Link>
            <Nav.Link as={Link} to="/users" className="nav-link-custom">Users</Nav.Link>

          </Nav>
        </Navbar.Collapse>

        {/* Right Side Icons */}
        <div className="d-flex align-items-center">
          <Bell size={20} className="header-icon mx-2" />
          <Mail size={20} className="header-icon mx-2" />
          <Sun size={20} className="header-icon mx-2" />
          <Settings size={20} className="header-icon mx-2" />

          {user && (
            <img
              src={user.profilePic}
              alt="Profile"
              width="32"
              height="32"
              className="rounded-circle ms-3 profile-img"
            />
          )}


{/**  Static prfile below for now, delete when backend */}
          <img
              src="/default_profile.jpg" // or whatever default path you’re using
              alt="Profile"
              width="32"
              height="32"
              className="rounded-circle mr-3 ms-3 profile-img"
            />
{/**  Static prfile for now, delete when backend */}


        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
