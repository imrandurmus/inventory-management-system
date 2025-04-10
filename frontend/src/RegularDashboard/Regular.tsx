import React from 'react';
import RDashboard from './RDashboard';
import RHeader from './RHeader';

const RegularDashboard: React.FC = () => {
  return (
    <>
    <RHeader />
    <div>
      <RDashboard />
    </div>
    </>
  );
};

export default RegularDashboard;
