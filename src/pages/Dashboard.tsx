import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { LogOut, User, Settings, TrendingUp, Dumbbell, Camera, Mic, Apple, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({
    age: user?.age || '',
    gender: user?.gender || 'male'
  });

  // Update editedUser when user data changes
  useEffect(() => {
    if (!isEditingProfile) {
      setEditedUser({
        age: user?.age?.toString() || '',
        gender: user?.gender || 'male'
      });
    }
  }, [user, isEditingProfile]);

  const quickActions = [
    { name: 'Body Analysis', icon: Camera, href: '/body-analysis', color: 'bg-purple-500' },
    { name: 'Workouts', icon: Dumbbell, href: '/workouts', color: 'bg-blue-500' },
    { name: 'Meal Planner', icon: Apple, href: '/meals', color: 'bg-green-500' },
    { name: 'Voice Coach', icon: Mic, href: '/voice-coach', color: 'bg-orange-500' },
  ];

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedUser({
      age: user?.age || '',
      gender: user?.gender || 'male'
    });
  };

  const handleSaveProfile = async () => {
    try {
      // Validate age input
      const age = parseInt(editedUser.age.toString());
      if (isNaN(age) || age < 13 || age > 120) {
        alert('Please enter a valid age between 13 and 120');
        return;
      }

      // Call the update profile API
      await updateProfile({
        age: age,
        gender: editedUser.gender
      });

      // Close edit mode on success
      setIsEditingProfile(false);
      
      // Show success message (you could replace this with a toast notification)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedUser({
      age: user?.age?.toString() || '',
      gender: user?.gender || 'male'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="FitPro Logo" className="h-10 w-10 object-contain" />
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FitPro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome, {user?.name}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                user?.subscriptionType === 'premium' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
              }`}>
                {user?.subscriptionType?.toUpperCase()}
              </span>
              <Link
                to="/settings"
                className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={logout}
                className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name}!
            </h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Ready to achieve your fitness goals with AI-powered guidance?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className={`p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {action.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get personalized {action.name.toLowerCase()} recommendations
                </p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Weekly Goal Progress</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>75%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Summary</h3>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={handleEditProfile}
                    className={`p-1 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                    title="Edit Profile"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Age:</label>
                    <input
                      type="number"
                      min="13"
                      max="120"
                      value={editedUser.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gender:</label>
                    <select
                      value={editedUser.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Age:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.age || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Gender:</span>
                    <span className={`font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.gender || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Plan:</span>
                    <span className={`font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.subscriptionType}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;