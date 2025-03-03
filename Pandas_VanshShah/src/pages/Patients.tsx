import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Edit, Trash2, Eye } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  triageLevel: 'Immediate' | 'Urgent' | 'Delayed';
  arrivalTime: string;
  status: 'Waiting' | 'In Treatment' | 'Discharged';
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Patient>('arrivalTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterTriageLevel, setFilterTriageLevel] = useState<string>('all');
  
  // Mock patient data
  const patientsData: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      condition: 'Chest Pain',
      triageLevel: 'Immediate',
      arrivalTime: '08:30 AM',
      status: 'In Treatment'
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      condition: 'Broken Arm',
      triageLevel: 'Urgent',
      arrivalTime: '09:15 AM',
      status: 'Waiting'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 68,
      gender: 'Male',
      condition: 'Stroke Symptoms',
      triageLevel: 'Immediate',
      arrivalTime: '07:45 AM',
      status: 'In Treatment'
    },
    {
      id: '4',
      name: 'Emily Davis',
      age: 28,
      gender: 'Female',
      condition: 'Fever',
      triageLevel: 'Delayed',
      arrivalTime: '10:00 AM',
      status: 'Waiting'
    },
    {
      id: '5',
      name: 'Michael Wilson',
      age: 52,
      gender: 'Male',
      condition: 'Abdominal Pain',
      triageLevel: 'Urgent',
      arrivalTime: '09:30 AM',
      status: 'In Treatment'
    },
    {
      id: '6',
      name: 'Sarah Brown',
      age: 41,
      gender: 'Female',
      condition: 'Allergic Reaction',
      triageLevel: 'Urgent',
      arrivalTime: '08:50 AM',
      status: 'Discharged'
    },
    {
      id: '7',
      name: 'David Miller',
      age: 75,
      gender: 'Male',
      condition: 'Fall Injury',
      triageLevel: 'Delayed',
      arrivalTime: '11:20 AM',
      status: 'Waiting'
    }
  ];
  
  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredPatients = patientsData
    .filter(patient => 
      (filterTriageLevel === 'all' || patient.triageLevel === filterTriageLevel) &&
      (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       patient.condition.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  const getTriageBadgeColor = (level: string) => {
    switch (level) {
      case 'Immediate': return 'bg-red-100 text-red-800';
      case 'Urgent': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Waiting': return 'bg-blue-100 text-blue-800';
      case 'In Treatment': return 'bg-purple-100 text-purple-800';
      case 'Discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Add New Patient
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-1" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterTriageLevel}
                onChange={(e) => setFilterTriageLevel(e.target.value)}
              >
                <option value="all">All Triage Levels</option>
                <option value="Immediate">Immediate</option>
                <option value="Urgent">Urgent</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Patients Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('triageLevel')}
                >
                  <div className="flex items-center">
                    Triage Level
                    {sortField === 'triageLevel' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('arrivalTime')}
                >
                  <div className="flex items-center">
                    Arrival Time
                    {sortField === 'arrivalTime' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">ID: {patient.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.age} years</div>
                    <div className="text-sm text-gray-500">{patient.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.condition}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTriageBadgeColor(patient.triageLevel)}`}>
                      {patient.triageLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.arrivalTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={18} />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPatients.length}</span> of{' '}
              <span className="font-medium">{filteredPatients.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <ChevronDown className="h-5 w-5 rotate-90" />
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <ChevronDown className="h-5 w-5 -rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;