import React, { useEffect } from 'react';
import { useMealStore } from '../stores/mealStore';
import { useThemeStore } from '../stores/themeStore';
import MealScanner from '../components/MealScanner';
import { Apple, TrendingUp, AlertCircle } from 'lucide-react';

const MealPlanner: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { analyses, getMealHistory, isLoading } = useMealStore();

  useEffect(() => {
    getMealHistory();
  }, [getMealHistory]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900' : ''}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Meal Planner</h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Scan your meals and get AI-powered nutrition analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MealScanner onAnalysisComplete={getMealHistory} />
        </div>

        <div className="space-y-6">
          <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <Apple className="h-6 w-6 text-green-500 mr-2" />
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Today's Summary</h2>
            </div>
            {analyses.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Meals Analyzed</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{analyses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Avg. Diet Score</span>
                  <span className={`font-semibold ${getScoreColor(
                    analyses.reduce((acc, a) => acc + a.dietaryScore, 0) / analyses.length
                  )}`}>
                    {Math.round(analyses.reduce((acc, a) => acc + a.dietaryScore, 0) / analyses.length)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total Calories</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(analyses.reduce((acc, a) => acc + a.totalNutrition.calories, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No meals analyzed yet today</p>
            )}
          </div>

          <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Analyses</h2>
            </div>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : analyses.length > 0 ? (
              <div className="space-y-3">
                {analyses.slice(0, 3).map((analysis) => (
                  <div key={analysis.id} className={`border rounded-lg p-3 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {analysis.mealType}
                      </span>
                      <span className={`text-sm font-semibold ${getScoreColor(analysis.dietaryScore)}`}>
                        {analysis.dietaryScore} ({getScoreLabel(analysis.dietaryScore)})
                      </span>
                    </div>
                    <div className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span>{Math.round(analysis.totalNutrition.calories)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span>{Math.round(analysis.totalNutrition.protein)}g</span>
                      </div>
                    </div>
                    <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {analysis.foodItems.slice(0, 2).map(item => item.name).join(', ')}
                      {analysis.foodItems.length > 2 && ` +${analysis.foodItems.length - 2} more`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No meal analyses yet</p>
                <p className="text-gray-400 text-xs mt-1">Start by scanning your first meal!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {analyses.length > 0 && (
        <div className="mt-8">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className={`rounded-lg shadow-sm border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{analysis.mealType}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.analysisDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(analysis.dietaryScore)}`}>
                    {analysis.dietaryScore}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  {analysis.foodItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-600">{Math.round(item.calories)} cal</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Calories: {Math.round(analysis.totalNutrition.calories)}</div>
                    <div>Protein: {Math.round(analysis.totalNutrition.protein)}g</div>
                    <div>Carbs: {Math.round(analysis.totalNutrition.carbs)}g</div>
                    <div>Fat: {Math.round(analysis.totalNutrition.fat)}g</div>
                  </div>
                </div>

                {analysis.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Recommendations:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;