import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Landing";
import AboutUs from "./AboutUs.tsx";
import Menu from "./Menu";
import React from "react";
import Login from "./Login.tsx";
import SignUp from "./SignUp.tsx";
import Contact from "./Contact.tsx";
import LearnMore from "./LearnMore.tsx";
import PrivacyPolicy from "./PrivacyPolicy.tsx";
import ForgotPassword from "./ForgotPassword.tsx";
import Manager from "./Manager/Manager.tsx";
import Items from "./Manager/Items.tsx";
import Orders from "./Manager/Orders.tsx";
import Invoices from "./Manager/Invoices.tsx";
import Reports from "./Manager/Reports.tsx";
import Users from "./Manager/Users.tsx";
import UserProfile from "./Manager/UserProfile.tsx";
import EditUser from "./Manager/EditUser.tsx";
import Announcements from "./Manager/Announcements.tsx";
import CreateAnnouncement from "./Manager/CreateAnnouncement.tsx";
import AnnouncementModal from "./Manager/AnnouncementModal.tsx";
import MSettings from "./Manager/MSettings.tsx";
import Regular from "./RegularDashboard/Regular.tsx";
import RAnnouncements from "./RegularDashboard/RAnnouncements.tsx";
import RSettings from "./RegularDashboard/RSettings.tsx";

// Protected Route: Requires a valid token
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/Login" replace />;
};

// Role-Based Route: Requires a token and specific role
const RoleBasedRoute: React.FC<{
  children: JSX.Element;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/Login" replace />;
  return role && allowedRoles.includes(role) ? (
    children
  ) : (
    <Navigate to="/Regular-Dashboard" replace />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword onClose={() => window.history.back()} />}
        />

        {/* Manager Routes (Protected, MANAGER role only) */}
        <Route
          path="/User-Dashboard"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Manager />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/items/products"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Items />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/items/orders"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Orders />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/items/invoices"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Invoices />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/Reports"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Reports />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/Users"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Users />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/Users/:id"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <UserProfile />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/Users/edit/:id"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <EditUser />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <Announcements />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/announcements/new"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <CreateAnnouncement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/announcements/:id"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <AnnouncementModal />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleBasedRoute allowedRoles={["MANAGER"]}>
              <MSettings />
            </RoleBasedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/Regular-Dashboard"
          element={
            <ProtectedRoute>
              <Regular />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RDashboard"
          element={
            <ProtectedRoute>
              <Regular />
            </ProtectedRoute>
          }
        />
        <Route
          path="/My-Announcements"
          element={
            <ProtectedRoute>
              <RAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/My-Settings"
          element={
            <ProtectedRoute>
              <RSettings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;