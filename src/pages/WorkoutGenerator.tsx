import React, { useEffect, useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import WorkoutGenerator from '../components/WorkoutGenerator';
import { Dumbbell, Clock, CheckCircle, Play, Star } from 'lucide-react';
import { toast } from 'sonner';

const WorkoutGeneratorPage: React.FC = () => {
  const { workoutPlans, getWorkoutPlans, currentWorkout, setCurrentWorkout, completeWorkout, isLoading } = useWorkoutStore();
  const [activeTab, setActiveTab] = useState<'generate' | 'plans'>('generate');

  useEffect(() => {
    getWorkoutPlans();
  }, [getWorkoutPlans]);

  const handleCompleteWorkout = async (workoutId: string, rating?: number) => {
    try {
      await completeWorkout(workoutId, rating);
      toast.success('Workout completed! Great job!');
    } catch (error) {
      toast.error('Failed to complete workout');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'lose_weight': return 'bg-blue-100 text-blue-800';
      case 'build_muscle': return 'bg-purple-100 text-purple-800';
      case 'maintain': return 'bg-gray-100 text-gray-800';
      case 'improve_endurance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Generator</h1>
        <p className="text-gray-600">Get personalized AI-generated workout plans based on your goals</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generate New
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Plans ({workoutPlans.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'generate' && (
        <WorkoutGenerator onWorkoutGenerated={() => {
          setActiveTab('plans');
          getWorkoutPlans();
        }} />
      )}

      {activeTab === 'plans' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : workoutPlans.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workout plans yet</h3>
              <p className="text-gray-600 mb-4">Generate your first AI-powered workout plan!</p>
              <button
                onClick={() => setActiveTab('generate')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Workout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans?.map((plan) => (
                <div key={plan?.id || `plan-${Math.random()}`} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                      {plan.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {plan.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      {plan.caloriesBurned} calories
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className={`px-2 py-1 text-xs rounded ${getGoalColor(plan.fitnessGoal)}`}>
                        {plan.fitnessGoal.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Exercises ({plan.exercises.length})</h4>
                    <div className="space-y-1">
                      {plan.exercises?.slice(0, 3).map((exercise, index) => (
                        <div key={`${plan.id}-exercise-${index}`} className="text-xs text-gray-600">
                          {exercise.name} - {exercise.sets}x{exercise.reps}
                        </div>
                      ))}
                      {plan.exercises?.length > 3 && (
                        <div className="text-xs text-gray-500">+{plan.exercises.length - 3} more</div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {!plan.isCompleted ? (
                      <button
                        onClick={() => setCurrentWorkout(plan)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                    )}
                    {plan.isCompleted && plan.userRating && (
                      <div className="flex items-center" key={`stars-${plan.id}`}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`star-${plan.id}-${i}`}
                            className={`h-4 w-4 ${
                              i < plan.userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentWorkout.name}</h2>
                  <p className="text-gray-600">{currentWorkout.description}</p>
                </div>
                <button
                  onClick={() => setCurrentWorkout(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentWorkout.duration}</div>
                  <div className="text-sm text-gray-600">minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentWorkout.caloriesBurned}</div>
                  <div className="text-sm text-gray-600">calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{currentWorkout.exercises.length}</div>
                  <div className="text-sm text-gray-600">exercises</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {currentWorkout?.exercises?.map((exercise, index) => (
                  <div key={`${currentWorkout.id}-exercise-${index}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                      <span className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{exercise.instructions}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Rest: {exercise.restSeconds}s
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleCompleteWorkout(currentWorkout.id)}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Workout
                </button>
                <button
                  onClick={() => setCurrentWorkout(null)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutGeneratorPage;