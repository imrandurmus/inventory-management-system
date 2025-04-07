import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

const DashboardEmployee = lazy(() => import("./DashboardEmployee"));

const DashboardRouter: React.FC = () => {
    const navigate = useNavigate();
    const role: string | null = localStorage.getItem("userRole");

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/");
    };

    const getDashboardComponent = () => {
        switch (role) {
            case "admin":
                return  1 //<DashboardAdmin />;         //commented for now bc i need those files oussema it wont work otherwise :(
            case "manager":
                return 1 //<DashboardManager />;        //commented for now bc i need those files oussema
            case "employee":
                return <DashboardEmployee />;
            default:
                return <h2>Error! the role you entered is invalid please select a valid role</h2>;
        }
    };

    return (
        <div className="dashboard-container">
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
            <Suspense fallback={<h2>Loading...................</h2>}>{getDashboardComponent()}</Suspense>
        </div>
    );
};

export default DashboardRouter;
