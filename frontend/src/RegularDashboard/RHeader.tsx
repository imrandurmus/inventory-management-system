import React, { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bell, Sun } from 'lucide-react';
import "../CSS/Header.css";
import { handleLogout } from '../utils/auth';

interface User {
  username: string;
  profilePic: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
}

const RHeader: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetch('/api/user/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Failed to fetch user', err));

    fetch('/api/announcements/unread-count')
      .then(res => res.json())
      .then(data => setUnreadCount(data.count))
      .catch(err => console.error('Failed to fetch unread count', err));

    fetch('/api/announcements/unread')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setUnreadCount(data.length);
      })
      .catch(err => console.error('Failed to fetch announcements', err));
  }, []);

  return (
    <Navbar className="navigationBarr" expand="lg" fixed="top">
      <Container fluid className="d-flex align-items-center">
        {/* Middle Navigation */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <p className="nav-link-custom ml-2 mr-6 mt-2">Hello, User</p>
            <Nav.Link as={Link} to="/Regular-Dashboard" className="nav-link-custom">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/My-Announcements" className="nav-link-custom">Announcements</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Right Side Icons */}
        <div className="d-flex align-items-center">
          <div className="position-relative" ref={dropdownRef}>
            {/* Bell Icon with Dropdown */}
            <Dropdown show={showDropdown} onToggle={toggleDropdown}>
              <Dropdown.Toggle
                as="button"
                className="icon-button no-caret" // Add a custom class to target this toggle
                style={{ background: 'none', border: 'none', padding: 0 }}
                aria-label="Toggle announcements dropdown"
              >
                <Bell size={20} className="Dheader-icon mx-2 clickable-icon" />
                {unreadCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle badge-sm"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end" className="announcements-dropdown">
                {unreadCount > 0 ? (
                  <>
                    {announcements.slice(0, 5).map((announcement) => (
                      <Dropdown.Item
                        key={announcement.id}
                        as={Link}
                        to={`/My-Announcements/${announcement.id}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        <h6 className="mb-1">{announcement.title}</h6>
                        <p className="mb-0 text-muted">{announcement.message}</p>
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as={Link}
                      to="/My-Announcements"
                      onClick={() => setShowDropdown(false)}
                      className="text-center"
                    >
                      See All
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.ItemText className="text-center">
                    <p className="text-muted mb-0">No unread announcements</p>
                  </Dropdown.ItemText>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Sun size={20} className="Dheader-icon mb-2 mx-2" />

          {user ? (
            <NavDropdown
              title={
                <img
                  className="Mprofile"
                  src={user.profilePic}
                  alt="Profile"
                />
              }
              id="profile-dropdown"
              align="end"
              className="profile-dropdown"
            >
              <NavDropdown.Item as={Link} to="/settings">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavDropdown
              title={
                <img
                  src="/default_profile.jpg"
                  alt="Profile"
                  width="32"
                  height="32"
                  className="rounded-circle ms-3 profile-img"
                />
              }
              id="profile-dropdown"
              align="end"
              className="profile-dropdown"
            >
              <NavDropdown.Item as={Link} to="/My-Settings">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default RHeader;