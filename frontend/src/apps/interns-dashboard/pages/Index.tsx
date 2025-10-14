import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Redirect to dashboard page
  return <Navigate to="/interns/dashboard" replace />;
};

export default Index;