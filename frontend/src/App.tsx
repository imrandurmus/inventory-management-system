import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./";
import AboutUs from "./AboutUs.tsx";
import Menu from "./Menu";
import React from "react";
import EmployeePage from "./EmployeeDashboard/EmployeePage.tsx";
import ManagerPage from "./ManagerDashboard/ManagerPage.tsx";
import Login from "./Login.tsx";
import SignUp from "./SignUp.tsx";
import Contact from "./Contact.tsx";
import LearnMore from "./LearnMore.tsx";
import PrivacyPolicy from "./PrivacyPolicy.tsx";
import ForgotPassword from "./ForgotPassword.tsx";

//import "@fortawesome/fontawesome-free/css/all.min.css";

/**
import HomePage from "./dele/HomePage.tsx";
import InventoryPage from "./dele/InventoryPage.tsx";
import PackagesPage from "./dele/PackagesPage.tsx";
import RecentUpdatesPage from "./dele/RecentUpdatesPage.tsx";
import ProfilePage from "./dele/ProfilePage.tsx";
import ReportsPage from "./dele/ReportsPage.tsx";
import SalesOrdersPage from "./dele/SalesOrdersPage.tsx";
import AnnouncementsPage from "./dele/AnnouncementsPage.tsx";
import PurchasesPage from "./dele/PurchasesPage.tsx";
import CustomersPage from "./dele/CustomersPage.tsx";
import DashboardPage from "./dele/DashboardPage.tsx";
import Staff from "./dele/Staff.tsx";

 */
//function App() {      //old one, new one is oussema's below
  const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> //default page is landing
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword onClose={function (): void {
          throw new Error("Function not implemented.");
        } } />} />

{/*     <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<DashboardRouter />} />


        <Route path="/Admin-Dashboard" element={<AdminPage />} />
*/}
        <Route path="/Manager-Dashboard" element={<ManagerPage />} />
        <Route path="/Employee-Dashboard" element={<EmployeePage />} />
        <Route path="/manager" element={<ManagerPage />} />

         {/* Employee Dashboard Layout
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

          Manager Dashboard Layout
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
 */}
         {/* Admin Dashboard Layout */}
         

         
        
      </Routes>
    </Router>
  );
}

export default App;