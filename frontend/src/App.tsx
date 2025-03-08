import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing, Login } from "./";
//import Authentication from "./Authentication";
//import DashboardRouter from "./DashboardRouter.tsx";
import AboutUs from "./AboutUs.tsx";
import SignupForm from "./SignupForm";
import Menu from "./Menu";
import React from "react";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import EmployeePage from "./EmployeeDashboard/EmployeePage.tsx";
import AdminPage from "./AdminDashboard/AdminPage.tsx";
import ManagerPage from "./ManagerDashboard/ManagerPage.tsx";
import HomePage from "./components/HomePage.tsx";
import InventoryPage from "./components/InventoryPage.tsx";
import PackagesPage from "./components/PackagesPage.tsx";
import RecentUpdatesPage from "./components/RecentUpdatesPage.tsx";
import ProfilePage from "./components/ProfilePage.tsx";
import ReportsPage from "./components/ReportsPage.tsx";
import SalesOrdersPage from "./components/SalesOrdersPage.tsx";
import AnnouncementsPage from "./components/AnnouncementsPage.tsx";
import PurchasesPage from "./components/PurchasesPage.tsx";
import CustomersPage from "./components/CustomersPage.tsx";
import DashboardPage from "./components/DashboardPage.tsx";
import Staff from "./components/Staff.tsx";


//function App() {      //old one, new one is oussema's below
  const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> //default page is landing
        <Route path="/Login" element={<Login />} />
       <Route path="/SignupForm" element={<SignupForm />} />
        <Route path="/menu" element={<Menu />} />

{/*     <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
*/}
        <Route path="/Admin-Dashboard" element={<AdminPage />} />
        <Route path="/Manager-Dashboard" element={<ManagerPage />} />
        <Route path="/Employee-Dashboard" element={<EmployeePage />} />
        <Route path="/manager" element={<ManagerPage />} />

         {/* Employee Dashboard Layout */}
        <Route path="/employee" element={<EmployeePage />}>
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="sales/customers" element={<CustomersPage />} />
          <Route path="sales/orders" element={<SalesOrdersPage />} />
          <Route path="sales/packages" element={<PackagesPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="recent-updates" element={<RecentUpdatesPage />} />
        </Route>

         {/* Manager Dashboard Layout */}
        <Route path="/manager" element={<ManagerPage />}>
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="sales/customers" element={<CustomersPage />} />
          <Route path="sales/orders" element={<SalesOrdersPage />} />
          <Route path="sales/packages" element={<PackagesPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="recent-updates" element={<RecentUpdatesPage />} />
          <Route path="staff" element={<Staff />} />
          
        </Route>
          
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        
      </Routes>
    </Router>
  );
}

export default App;