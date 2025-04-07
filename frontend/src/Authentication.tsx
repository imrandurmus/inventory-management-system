import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Login.css";

const Authentication: React.FC = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role: string) => {
        localStorage.setItem("userRole", role);
        navigate("/dashboard");
    };

    return (
        <div className="login-container">
            <div className="role-buttons">
                <button onClick={() => handleRoleSelect("admin")}>Admin</button>
                <button onClick={() => handleRoleSelect("manager")}>Manager</button>
                <button onClick={() => handleRoleSelect("employee")}>Employee</button>
            </div>
        </div>
    );
};

export default Authentication;
