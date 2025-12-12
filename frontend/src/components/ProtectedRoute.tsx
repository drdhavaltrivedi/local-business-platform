import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '@shared/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, hasRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

