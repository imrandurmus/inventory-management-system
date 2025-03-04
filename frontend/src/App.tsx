import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing, Login, SignUp } from "./";
import Authentication from "./Authentication";
import DashboardRouter from "./DashboardRouter.tsx";
import AboutUs from "./AboutUs.tsx";
//import "./colors.css";
import Menu from "./Menu";
import React from "react";


//function App() {      //old one, new one is oussema's below
  const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> //default page is landing
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;