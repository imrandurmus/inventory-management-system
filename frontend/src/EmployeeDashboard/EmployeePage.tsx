// src/pages/DashboardPage.tsx
import React from 'react';
import Dashboard from '../DashComponents/Dashboard';
//import Navbar from '/Users/afagh/Desktop/cmpe356/frontend/src/components/Navigation.tsx';
import Header from '../DashComponents/Header';

const EmployeePage: React.FC = () => {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
};

export default EmployeePage;
