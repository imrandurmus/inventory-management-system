import { useNavigate } from 'react-router-dom';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token;
};

// Get user role
export const getUserRole = (): string | null => {
  return localStorage.getItem("role") || sessionStorage.getItem("role");
};

// Handle logout
export const handleLogout = () => {
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();

  // Clear any other stored data
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Redirect to login
  window.location.href = '/Login';
}; 