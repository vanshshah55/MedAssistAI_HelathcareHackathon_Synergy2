import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Ambulance, 
  Bed, 
  UserCheck, 
  Package 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Mock data for the dashboard
  const triageData = [
    { name: 'Immediate', value: 12, color: '#EF4444' },
    { name: 'Urgent', value: 24, color: '#F59E0B' },
    { name: 'Delayed', value: 38, color: '#10B981' },
  ];
  
  const patientFlowData = [
    { time: '00:00', patients: 12 },
    { time: '04:00', patients: 8 },
    { time: '08:00', patients: 15 },
    { time: '12:00', patients: 25 },
    { time: '16:00', patients: 32 },
    { time: '20:00', patients: 20 },
  ];
  
  const resourceUtilizationData = [
    { name: 'Ambulances', available: 8, inUse: 4 },
    { name: 'ICU Beds', available: 5, inUse: 3 },
    { name: 'ER Rooms', available: 12, inUse: 9 },
    { name: 'Ventilators', available: 10, inUse: 4 },
  ];
  
  const criticalAlerts = [
    { id: 1, patient: 'John Doe', condition: 'Cardiac Arrest', time: '10 min ago', severity: 'high' },
    { id: 2, patient: 'Jane Smith', condition: 'Respiratory Failure', time: '15 min ago', severity: 'high' },
    { id: 3, patient: 'Robert Johnson', condition: 'Stroke', time: '25 min ago', severity: 'medium' },
  ];
  
  const stats = [
    { label: 'Total Patients', value: 74, icon: <Users size={20} className="text-blue-500" /> },
    { label: 'Critical Cases', value: 12, icon: <AlertTriangle size={20} className="text-red-500" /> },
    { label: 'Avg. Wait Time', value: '18 min', icon: <Clock size={20} className="text-yellow-500" /> },
    { label: 'AI Diagnoses', value: 56, icon: <Activity size={20} className="text-green-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Emergency Response Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTimeRange('day')}
          >
            Today
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-full bg-gray-100">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Triage Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={triageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {triageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Patient Flow */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Patient Flow (24h)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patients" stroke="#3B82F6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Resource Utilization */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Resource Utilization</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={resourceUtilizationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inUse" stackId="a" fill="#3B82F6" name="In Use" />
              <Bar dataKey="available" stackId="a" fill="#93C5FD" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Critical Alerts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Critical Alerts</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {criticalAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.condition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.severity === 'high' ? 'High' : 'Medium'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Resource Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Ambulance size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ambulances</p>
              <p className="text-lg font-semibold">4/8 Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <Bed size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ICU Beds</p>
              <p className="text-lg font-semibold">2/5 Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 mr-3">
              <UserCheck size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Medical Staff</p>
              <p className="text-lg font-semibold">12 On Duty</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <Package size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical Supplies</p>
              <p className="text-lg font-semibold">85% Stocked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;