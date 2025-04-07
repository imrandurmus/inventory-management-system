import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./";
import AboutUs from "./AboutUs.tsx";
import Menu from "./Menu";
import React from "react";
import EmployeePage from "./EmployeeDashboard/EmployeePage.tsx";
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

{/*  Manager page routes    */}
        <Route path="/User-Dashboard" element={<Manager />} />
        <Route path="/items/products" element={<Items />} />
        <Route path="/items/orders" element={<Orders />} />
        <Route path="/items/invoices" element={<Invoices />} />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Users/:id" element={<UserProfile />} />
        <Route path="/Users/edit/:id" element={<EditUser />} />

{/* Employee Dashboard Layout*/}
        <Route path="/Employee-Dashboard" element={<EmployeePage />} />
{/* Admin Dashboard Layout */}
    </Routes>
</Router>
  );
}

export default App;