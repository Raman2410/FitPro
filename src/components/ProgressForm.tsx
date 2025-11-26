import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import { toast } from 'sonner';

interface ProgressFormData {
  weight: string;
  bodyFat: string;
  muscleMass: string;
  notes: string;
}

const ProgressForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProgressFormData>({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to add progress data');
      return;
    }

    try {
      setLoading(true);
      const data = {
        weight: parseFloat(formData.weight),
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
        notes: formData.notes
      };

      await api.post('/progress', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Progress data added successfully!');
      setFormData({ weight: '', bodyFat: '', muscleMass: '', notes: '' });
      onSuccess?.();
    } catch (error) {
      console.error('Error adding progress data:', error);
      toast.error('Failed to add progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Progress Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg) *
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="30"
            max="300"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your weight"
          />
        </div>

        <div>
          <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-1">
            Body Fat (%)
          </label>
          <input
            type="number"
            id="bodyFat"
            name="bodyFat"
            value={formData.bodyFat}
            onChange={handleChange}
            step="0.1"
            min="3"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter body fat percentage"
          />
        </div>

        <div>
          <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-1">
            Muscle Mass (kg)
          </label>
          <input
            type="number"
            id="muscleMass"
            name="muscleMass"
            value={formData.muscleMass}
            onChange={handleChange}
            step="0.1"
            min="20"
            max="200"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter muscle mass"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional notes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Progress Data'}
        </button>
      </form>
    </div>
  );
};

export default ProgressForm;