// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='p-8 flex justify-center items-center h-[calc(100vh-64px)]'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!user) {
    // User is not authenticated, redirect to login page
    return <Navigate to='/admin/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
