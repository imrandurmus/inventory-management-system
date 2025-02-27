import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Landing from "./Landing";
//import Login from "./Login";
//import SignUp from "./SignUp";
import { Landing, Login, SignUp } from "./";
import Menu from "./Menu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> //default page is landing
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
