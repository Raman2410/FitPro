import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AuthForm 
        isLogin={isLogin} 
        onToggle={() => setIsLogin(!isLogin)} 
      />
    </div>
  );
};

export default AuthPage;