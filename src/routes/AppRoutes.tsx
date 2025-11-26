import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import BodyAnalysis from '../pages/BodyAnalysis';
import WorkoutGenerator from '../pages/WorkoutGenerator';
import MealPlanner from '../pages/MealPlanner';
import VoiceCoach from '../pages/VoiceCoach';
import Progress from '../pages/Progress';
import Settings from '../pages/Settings';
import Upgrade from '../pages/Upgrade';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/body-analysis" element={
        <ProtectedRoute>
          <BodyAnalysis />
        </ProtectedRoute>
      } />
      <Route path="/workouts" element={
        <ProtectedRoute>
          <WorkoutGenerator />
        </ProtectedRoute>
      } />
      <Route path="/meals" element={
        <ProtectedRoute>
          <MealPlanner />
        </ProtectedRoute>
      } />
      <Route path="/voice-coach" element={
        <ProtectedRoute requirePremium={true}>
          <VoiceCoach />
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/upgrade" element={
        <ProtectedRoute>
          <Upgrade />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;