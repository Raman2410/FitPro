import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { settingsService } from '../services/settingsService';
import { toast } from 'sonner';
import { ChevronRight, User, Target, Brain, Apple, Bell, Shield, Settings as SettingsIcon, Moon, Sun, Globe, Download, Trash2, Star, Mail, Phone } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // Profile section state
  const [profileData, setProfileData] = useState({
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    height: '',
    weight: '',
    bodyType: '' as 'Ectomorph' | 'Mesomorph' | 'Endomorph' | ''
  });

  // Goals section state
  const [goalsData, setGoalsData] = useState({
    fitnessGoals: [] as string[],
    dailyStepGoal: 10000,
    weeklyWorkouts: 3,
    preferredWorkoutTime: 'Morning' as 'Morning' | 'Afternoon' | 'Evening' | 'Night'
  });

  // AI Preferences state
  const [aiPreferences, setAiPreferences] = useState({
    difficulty: 'moderate' as 'easy' | 'moderate' | 'hard',
    workoutLength: 30,
    voiceCoach: true,
    voiceType: 'female' as 'male' | 'female' | 'robotic',
    equipment: [] as string[]
  });

  // Diet section state
  const [dietData, setDietData] = useState({
    dietType: 'balanced' as 'Veg' | 'Non-Veg' | 'Vegan' | 'Keto' | 'High-Protein',
    calorieGoal: 2000,
    allergies: [] as string[],
    aiMealDetection: false
  });
  const [dietType, setDietType] = useState('balanced');

  // Notifications state
  const [notifications, setNotifications] = useState({
    workout: true,
    water: true,
    meal: false,
    progress: true,
    motivation: true,
    workoutTime: '07:00',
    waterTime: '10:00'
  });

  // Units state
  const [units, setUnits] = useState({ 
    weight: 'kg' as 'kg' | 'lbs', 
    height: 'cm' as 'cm' | 'ft' 
  });

  // Load existing settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      if (response.success && response.settings) {
        const settings = response.settings;
        
        // Update all form states with loaded settings
        if (settings.profile) {
          setProfileData(prev => ({ ...prev, ...settings.profile }));
        }
        if (settings.goals) {
          setGoalsData(prev => ({ ...prev, ...settings.goals }));
        }
        if (settings.aiPreferences) {
          setAiPreferences(prev => ({ ...prev, ...settings.aiPreferences }));
        }
        if (settings.diet) {
          setDietData(prev => ({ ...prev, ...settings.diet }));
        }
        if (settings.notifications) {
          setNotifications(prev => ({ ...prev, ...settings.notifications }));
        }
        if (settings.units) {
          setUnits(prev => ({ ...prev, ...settings.units }));
        }
        if (settings.theme) {
          // Update theme store
          const { setDarkMode } = useThemeStore.getState();
          if (settings.theme.darkMode !== undefined) {
            setDarkMode(settings.theme.darkMode);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      let response;
      
      switch (activeSection) {
        case 'profile':
          response = await settingsService.updateProfile({
            age: profileData.age ? parseInt(profileData.age as string) : undefined,
            gender: profileData.gender as 'male' | 'female' | 'other',
            height: profileData.height ? parseInt(profileData.height as string) : undefined,
            weight: profileData.weight ? parseInt(profileData.weight as string) : undefined,
            bodyType: profileData.bodyType as 'Ectomorph' | 'Mesomorph' | 'Endomorph' | undefined
          });
          break;
          
        case 'goals':
          response = await settingsService.updateGoals(goalsData);
          break;
          
        case 'ai':
          response = await settingsService.updateAIPreferences(aiPreferences);
          break;
          
        case 'diet':
          response = await settingsService.updateDiet(dietData);
          break;
          
        case 'notifications':
          response = await settingsService.updateNotifications(notifications);
          break;
          
        case 'app':
          response = await settingsService.updateTheme({ darkMode: isDarkMode });
          if (response.success) {
            response = await settingsService.updateUnits(units);
          }
          break;
          
        default:
          response = await settingsService.updateSettings({
            profile: {
              age: profileData.age ? parseInt(profileData.age as string) : undefined,
              gender: profileData.gender as 'male' | 'female' | 'other',
              height: profileData.height ? parseInt(profileData.height as string) : undefined,
              weight: profileData.weight ? parseInt(profileData.weight as string) : undefined,
              bodyType: profileData.bodyType as 'Ectomorph' | 'Mesomorph' | 'Endomorph' | undefined
            },
            goals: goalsData,
            aiPreferences,
            diet: dietData,
            notifications,
            theme: { darkMode: isDarkMode },
            units
          });
      }

      if (response.success) {
        toast.success(response.message || 'Settings updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    switch (section) {
      case 'profile':
        setProfileData(prev => ({ ...prev, [field]: value }));
        break;
      case 'goals':
        setGoalsData(prev => ({ ...prev, [field]: value }));
        break;
      case 'diet':
        setDietData(prev => ({ ...prev, [field]: value }));
        break;
      case 'notifications':
        setNotifications(prev => ({ ...prev, [field]: value }));
        break;
      case 'units':
        setUnits(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const sections = [
    { id: 'profile', title: 'Personal Profile', icon: User, description: 'Manage your personal information' },
    { id: 'goals', title: 'Your Goals', icon: Target, description: 'Set your fitness objectives' },
    { id: 'ai', title: 'AI Settings', icon: Brain, description: 'Customize AI workout preferences' },
    { id: 'diet', title: 'Diet Preferences', icon: Apple, description: 'Configure your nutrition settings' },
    { id: 'notifications', title: 'Reminders & Alerts', icon: Bell, description: 'Manage notification preferences' },
    { id: 'privacy', title: 'Account & Privacy', icon: Shield, description: 'Control your data and privacy' },
    { id: 'app', title: 'Application Settings', icon: SettingsIcon, description: 'App appearance and preferences' }
  ];

  const getCardClasses = () => {
    return isDarkMode 
      ? 'bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700' 
      : 'bg-white rounded-xl shadow-sm p-6 border border-gray-100';
  };

  const getHeadingClasses = () => {
    return isDarkMode ? 'text-lg font-semibold text-white mb-4' : 'text-lg font-semibold text-gray-900 mb-4';
  };

  const getLabelClasses = () => {
    return isDarkMode ? 'block text-sm font-medium text-gray-300 mb-1' : 'block text-sm font-medium text-gray-700 mb-1';
  };

  const getInputClasses = () => {
    return `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
        : 'bg-white border-gray-300 text-gray-900'
    }`;
  };

  const getSelectClasses = () => {
    return `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-900'
    }`;
  };

  const getButtonClasses = (selected = false) => {
    const baseClasses = 'p-4 border-2 rounded-lg transition-all';
    if (selected) {
      return `${baseClasses} ${isDarkMode 
        ? 'border-blue-500 bg-blue-900 text-blue-300' 
        : 'border-blue-500 bg-blue-50 text-blue-700'
      }`;
    }
    return `${baseClasses} ${isDarkMode 
      ? 'border-gray-600 hover:border-blue-500 hover:bg-blue-900 text-gray-300' 
      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-900'
    }`;
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Profile Information</h3>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Not set'}</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={getLabelClasses()}>Age</label>
            <input 
              type="number" 
              value={profileData.age} 
              onChange={(e) => setProfileData({...profileData, age: e.target.value})}
              className={getInputClasses()} 
              placeholder="Enter your age" 
            />
          </div>
          <div>
            <label className={getLabelClasses()}>Gender</label>
            <select 
              value={profileData.gender} 
              onChange={(e) => setProfileData({...profileData, gender: e.target.value as 'male' | 'female' | 'other'})}
              className={getSelectClasses()}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={getLabelClasses()}>Height (cm)</label>
            <input 
              type="number" 
              value={profileData.height} 
              onChange={(e) => setProfileData({...profileData, height: e.target.value})}
              className={getInputClasses()} 
              placeholder="170" 
            />
          </div>
          <div>
            <label className={getLabelClasses()}>Weight (kg)</label>
            <input 
              type="number" 
              value={profileData.weight} 
              onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
              className={getInputClasses()} 
              placeholder="70" 
            />
          </div>
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Body Type</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Ectomorph', 'Mesomorph', 'Endomorph'].map((type) => (
            <button 
              key={type} 
              onClick={() => setProfileData({...profileData, bodyType: type as 'Ectomorph' | 'Mesomorph' | 'Endomorph'})}
              className={getButtonClasses(profileData.bodyType === type)}
            >
              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{type}</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>Learn more</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoalsSection = () => (
    <div className="space-y-6">
      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Fitness Goals</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {['Fat Loss', 'Muscle Gain', 'Strength Training', 'Endurance', 'General Fitness'].map((goal) => (
            <button 
              key={goal} 
              onClick={() => {
                const currentGoals = goalsData.fitnessGoals;
                const newGoals = currentGoals.includes(goal) 
                  ? currentGoals.filter(g => g !== goal)
                  : [...currentGoals, goal];
                setGoalsData({...goalsData, fitnessGoals: newGoals});
              }}
              className={`p-3 rounded-lg transition-all text-sm font-medium ${getButtonClasses(goalsData.fitnessGoals.includes(goal))}`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Workout Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className={getLabelClasses().replace('mb-1', 'mb-2')}>Daily Step Goal</label>
            <input 
              type="range" 
              min="1000" 
              max="20000" 
              step="1000" 
              value={goalsData.dailyStepGoal}
              onChange={(e) => setGoalsData({...goalsData, dailyStepGoal: parseInt(e.target.value)})}
              className="w-full" 
            />
            <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              <span>1K</span>
              <span className="font-medium">{goalsData.dailyStepGoal.toLocaleString()} steps</span>
              <span>20K</span>
            </div>
          </div>
          <div>
            <label className={getLabelClasses().replace('mb-1', 'mb-2')}>Weekly Workouts</label>
            <div className="flex space-x-2">
              {[1,2,3,4,5,6,7].map((day) => (
                <button 
                  key={day} 
                  onClick={() => setGoalsData({...goalsData, weeklyWorkouts: day})}
                  className={`w-10 h-10 rounded-lg transition-all text-sm font-medium ${getButtonClasses(goalsData.weeklyWorkouts === day)}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={getLabelClasses().replace('mb-1', 'mb-2')}>Preferred Workout Time</label>
            <select 
              value={goalsData.preferredWorkoutTime}
              onChange={(e) => setGoalsData({...goalsData, preferredWorkoutTime: e.target.value as 'Morning' | 'Afternoon' | 'Evening' | 'Night'})}
              className={getSelectClasses()}
            >
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISection = () => (
    <div className="space-y-6">
      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>AI Workout Settings</h3>
        <div className="space-y-4">
          <div>
            <label className={getLabelClasses().replace('mb-1', 'mb-2')}>AI Workout Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {['Easy', 'Moderate', 'Hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setAiPreferences({...aiPreferences, difficulty: difficulty.toLowerCase() as 'easy' | 'moderate' | 'hard'})}
                  className={`p-3 rounded-lg border transition-all ${
                    aiPreferences.difficulty === difficulty.toLowerCase()
                      ? (isDarkMode ? 'border-blue-500 bg-blue-900 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-700')
                      : (isDarkMode ? 'border-gray-600 hover:border-blue-500 text-gray-300' : 'border-gray-200 hover:border-blue-300 text-gray-900')
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={getLabelClasses().replace('mb-1', 'mb-2')}>Workout Length</label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={aiPreferences.workoutLength}
              onChange={(e) => setAiPreferences({...aiPreferences, workoutLength: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              <span>10 min</span>
              <span className="font-medium">{aiPreferences.workoutLength} min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Equipment Availability</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Dumbbells', 'Resistance Bands', 'Barbell', 'No Equipment'].map((equipment) => (
            <label key={equipment} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isDarkMode ? 'border border-gray-600 hover:bg-gray-700' : 'border border-gray-200 hover:bg-gray-50'}`}>
              <input 
                type="checkbox" 
                checked={aiPreferences.equipment.includes(equipment)}
                onChange={(e) => {
                  const currentEquipment = aiPreferences.equipment;
                  const newEquipment = e.target.checked
                    ? [...currentEquipment, equipment]
                    : currentEquipment.filter(eq => eq !== equipment);
                  setAiPreferences({...aiPreferences, equipment: newEquipment});
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{equipment}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>AI Voice Coach</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enable Voice Coach</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get audio guidance during workouts</p>
            </div>
            <button
              onClick={() => setAiPreferences({...aiPreferences, voiceCoach: !aiPreferences.voiceCoach})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiPreferences.voiceCoach ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                aiPreferences.voiceCoach ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          {aiPreferences.voiceCoach && (
            <div>
              <label className={getLabelClasses().replace('mb-1', 'mb-2')}>Select Voice</label>
              <select
                value={aiPreferences.voiceType}
                onChange={(e) => setAiPreferences({...aiPreferences, voiceType: e.target.value as 'male' | 'female' | 'robotic'})}
                className={getSelectClasses()}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="robotic">AI Robotic</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDietSection = () => (
    <div className="space-y-6">
      <div className={`${getCardClasses()}`}>
        <h3 className={getHeadingClasses()}>Diet Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Veg', 'Non-Veg', 'Vegan', 'Keto', 'High-Protein'].map((diet) => (
            <button
              key={diet}
              onClick={() => {
                const newDietType = diet.toLowerCase().replace('-', '') as 'Veg' | 'Non-Veg' | 'Vegan' | 'Keto' | 'High-Protein';
                setDietType(newDietType);
                setDietData({...dietData, dietType: newDietType});
              }}
              className={`p-3 rounded-lg border transition-all ${
                dietData.dietType === diet.toLowerCase().replace('-', '')
                  ? (isDarkMode ? 'border-green-500 bg-green-900 text-green-300' : 'border-green-500 bg-green-50 text-green-700')
                  : (isDarkMode ? 'border-gray-600 hover:border-green-500 text-gray-300' : 'border-gray-200 hover:border-green-300')
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      <div className={`${getCardClasses()}`}>
        <h3 className={getHeadingClasses()}>Daily Goals</h3>
        <div className="space-y-4">
          <div>
            <label className={getLabelClasses()}>Calorie Goal</label>
            <input 
              type="number" 
              value={dietData.calorieGoal}
              onChange={(e) => setDietData({...dietData, calorieGoal: parseInt(e.target.value) || 2000})}
              className={getInputClasses()}
              placeholder="2000" 
            />
          </div>
          <div>
            <label className={getLabelClasses()}>Allergies</label>
            <div className="flex flex-wrap gap-2">
              {['Nuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish'].map((allergy) => (
                <button 
                  key={allergy} 
                  onClick={() => {
                    const currentAllergies = dietData.allergies;
                    const newAllergies = currentAllergies.includes(allergy)
                      ? currentAllergies.filter(a => a !== allergy)
                      : [...currentAllergies, allergy];
                    setDietData({...dietData, allergies: newAllergies});
                  }}
                  className={`px-3 py-1 border rounded-full text-sm transition-all ${
                    dietData.allergies.includes(allergy)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${getCardClasses()}`}>
        <h3 className={getHeadingClasses()}>AI Features</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Meal Detection via Camera</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Automatically log meals using AI image recognition</p>
          </div>
          <button 
            onClick={() => setDietData({...dietData, aiMealDetection: !dietData.aiMealDetection})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              dietData.aiMealDetection ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              dietData.aiMealDetection ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'workout', title: 'Daily Workout Reminder', desc: 'Get reminded to workout daily' },
            { key: 'water', title: 'Water Intake Reminder', desc: 'Stay hydrated with timely reminders' },
            { key: 'meal', title: 'Meal Logging Reminder', desc: 'Track your nutrition consistently' },
            { key: 'progress', title: 'Weekly Progress Report', desc: 'Review your fitness journey weekly' },
            { key: 'motivation', title: 'Motivation Quotes', desc: 'Daily inspirational fitness quotes' }
          ].map((item) => (
            <div key={item.key} className={`flex items-center justify-between py-3 border-b last:border-0 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div>
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${getCardClasses()}`}>
        <h3 className={getHeadingClasses()}>Notification Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={getLabelClasses()}>Workout Time</label>
            <input 
              type="time" 
              value={notifications.workoutTime}
              onChange={(e) => setNotifications({...notifications, workoutTime: e.target.value})}
              className={getInputClasses()}
            />
          </div>
          <div>
            <label className={getLabelClasses()}>Water Reminder</label>
            <input 
              type="time" 
              value={notifications.waterTime}
              onChange={(e) => setNotifications({...notifications, waterTime: e.target.value})}
              className={getInputClasses()}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Account Management</h3>
        <div className="space-y-3">
          <button className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Manage Subscription</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-blue-500" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Download My Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all text-red-600 ${isDarkMode ? 'border-red-900 hover:bg-red-950' : 'border-red-200 hover:bg-red-50'}`}>
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Delete My Account</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Connected Devices</h3>
        <div className="space-y-3">
          {['Smartwatch', 'Fitness Band', 'Google Fit', 'Apple Health'].map((device) => (
            <div key={device} className={`flex items-center justify-between p-3 border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{device}</span>
              <button className={`px-3 py-1 text-sm border rounded-lg transition-all ${isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-900'}`}>
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppSection = () => (
    <div className="space-y-6">
      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} /> : <Sun className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />}
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div>
            <label className={getLabelClasses()}>Language</label>
            <select className={getSelectClasses()}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Units & Measurements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={getLabelClasses()}>Weight Units</label>
            <select
              value={units.weight}
              onChange={(e) => setUnits({...units, weight: e.target.value as 'kg' | 'lbs'})}
              className={getSelectClasses()}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>
          <div>
            <label className={getLabelClasses()}>Height Units</label>
            <select
              value={units.height}
              onChange={(e) => setUnits({...units, height: e.target.value as 'cm' | 'ft'})}
              className={getSelectClasses()}
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="ft">Feet & Inches</option>
            </select>
          </div>
        </div>
      </div>

      <div className={getCardClasses()}>
        <h3 className={getHeadingClasses()}>Advanced Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Offline Mode</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Use app without internet connection</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'goals': return renderGoalsSection();
      case 'ai': return renderAISection();
      case 'diet': return renderDietSection();
      case 'notifications': return renderNotificationsSection();
      case 'privacy': return renderPrivacySection();
      case 'app': return renderAppSection();
      default: return renderProfileSection();
    }
  };

  if (isPageLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-blue-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Settings</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Customize your fitness experience</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-4 sticky top-8`}>
              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${
                        activeSection === section.id
                          ? `${isDarkMode ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'}`
                          : `${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{section.description}</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {renderContent()}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveChanges}
                disabled={isLoading}
                className={`px-8 py-3 font-medium rounded-lg transition-all shadow-lg hover:shadow-xl ${
                  isLoading 
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button className={`flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Contact Support</span>
                </button>
                <button className={`flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Rate Us</span>
                </button>
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                AI Workout Planner v1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;