import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requirePremium = false }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requirePremium && user.subscriptionType !== 'premium') {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;