import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import ProgressForm from './ProgressForm';

interface ProgressData {
  _id: string;
  date: string;
  weight: number;
  bodyFat?: number;
}

const AnalyticsDashboard: React.FC = () => {
  const { token } = useAuthStore();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token) return;

    try {
      const [progressRes, predictionsRes] = await Promise.all([
        api.get('/progress', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/progress/predictions', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProgressData(progressRes.data.data || []);
      setPredictions(predictionsRes.data.predictions || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = progressData.map(data => ({
    date: new Date(data.date).toLocaleDateString(),
    weight: data.weight
  }));

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {predictions && (
            <div className="bg-blue-100 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Weekly Prediction</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Predicted Weight</p>
                  <p className="text-2xl font-bold">{predictions.predictedWeight}kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weekly Change</p>
                  <p className="text-2xl font-bold">{predictions.weeklyChange}kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold">{predictions.confidence}%</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <ProgressForm onSuccess={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;