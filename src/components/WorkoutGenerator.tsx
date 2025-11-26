import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Dumbbell, Clock, Target, Zap, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutGeneratorProps {
  onWorkoutGenerated?: () => void;
}

const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({ onWorkoutGenerated }) => {
  const [formData, setFormData] = useState({
    fitnessGoal: 'lose_weight',
    duration: 30,
    experience: 'beginner',
    equipment: [] as string[]
  });
  const { generateWorkout, isLoading } = useWorkoutStore();

  const equipmentOptions = [
    'None (Bodyweight only)',
    'Dumbbells',
    'Resistance Bands',
    'Yoga Mat',
    'Jump Rope',
    'Pull-up Bar',
    'Kettlebells'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.equipment.length === 0) {
      toast.error('Please select at least one equipment option');
      return;
    }

    try {
      await generateWorkout(formData);
      toast.success('Workout plan generated successfully!');
      onWorkoutGenerated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate workout');
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Generate AI Workout</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              Fitness Goal
            </label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="lose_weight">Lose Weight</option>
              <option value="build_muscle">Build Muscle</option>
              <option value="maintain">Maintain Fitness</option>
              <option value="improve_endurance">Improve Endurance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Workout Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, experience: level }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.experience === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Dumbbell className="inline h-4 w-4 mr-1" />
              Available Equipment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {equipmentOptions.map((equipment) => (
                <label
                  key={equipment}
                  className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.equipment.includes(equipment)}
                    onChange={() => handleEquipmentToggle(equipment)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || formData.equipment.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Generate AI Workout
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutGenerator;