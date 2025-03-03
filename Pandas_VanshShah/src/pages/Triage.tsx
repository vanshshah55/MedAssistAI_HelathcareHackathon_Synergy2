import React, { useState } from 'react';
import { AlertTriangle, Clock, Activity, Heart, Thermometer, Droplet, Settings as Lungs, Brain, Zap, CheckCircle, XCircle } from 'lucide-react';

interface PatientVitals {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  painLevel: number;
  consciousness: string;
}

interface TriagePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  arrivalTime: string;
  vitals: PatientVitals;
  triageScore?: number;
  triageLevel?: 'Immediate' | 'Urgent' | 'Delayed';
  aiConfidence?: number;
  riskFactors?: string[];
}

const Triage: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<TriagePatient | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  
  // Mock triage patients data
  const triagePatients: TriagePatient[] = [
    {
      id: '101',
      name: 'Thomas Anderson',
      age: 42,
      gender: 'Male',
      chiefComplaint: 'Severe chest pain radiating to left arm',
      arrivalTime: '10:15 AM',
      vitals: {
        heartRate: 110,
        bloodPressure: '160/95',
        temperature: 37.2,
        oxygenSaturation: 94,
        respiratoryRate: 22,
        painLevel: 8,
        consciousness: 'Alert'
      },
      triageScore: 18,
      triageLevel: 'Immediate',
      aiConfidence: 0.96,
      riskFactors: ['History of hypertension', 'Smoker', 'Family history of heart disease']
    },
    {
      id: '102',
      name: 'Maria Garcia',
      age: 28,
      gender: 'Female',
      chiefComplaint: 'Abdominal pain and vomiting',
      arrivalTime: '10:30 AM',
      vitals: {
        heartRate: 95,
        bloodPressure: '125/85',
        temperature: 38.1,
        oxygenSaturation: 98,
        respiratoryRate: 18,
        painLevel: 6,
        consciousness: 'Alert'
      },
      triageScore: 12,
      triageLevel: 'Urgent',
      aiConfidence: 0.89,
      riskFactors: ['Recent food poisoning in area', 'Dehydration']
    },
    {
      id: '103',
      name: 'James Wilson',
      age: 35,
      gender: 'Male',
      chiefComplaint: 'Twisted ankle while jogging',
      arrivalTime: '10:45 AM',
      vitals: {
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 36.8,
        oxygenSaturation: 99,
        respiratoryRate: 14,
        painLevel: 4,
        consciousness: 'Alert'
      },
      triageScore: 6,
      triageLevel: 'Delayed',
      aiConfidence: 0.94,
      riskFactors: ['Previous ankle injury']
    },
    {
      id: '104',
      name: 'Sarah Johnson',
      age: 65,
      gender: 'Female',
      chiefComplaint: 'Difficulty breathing, cough',
      arrivalTime: '11:00 AM',
      vitals: {
        heartRate: 105,
        bloodPressure: '145/90',
        temperature: 38.5,
        oxygenSaturation: 91,
        respiratoryRate: 24,
        painLevel: 5,
        consciousness: 'Alert'
      },
      triageScore: 15,
      triageLevel: 'Urgent',
      aiConfidence: 0.92,
      riskFactors: ['COPD', 'History of pneumonia', 'Diabetes']
    },
    {
      id: '105',
      name: 'David Kim',
      age: 22,
      gender: 'Male',
      chiefComplaint: 'Headache and dizziness after sports',
      arrivalTime: '11:15 AM',
      vitals: {
        heartRate: 88,
        bloodPressure: '130/85',
        temperature: 37.0,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        painLevel: 7,
        consciousness: 'Alert but disoriented'
      }
    }
  ];
  
  const handlePatientSelect = (patient: TriagePatient) => {
    setSelectedPatient(patient);
  };
  
  const handleRunAITriage = () => {
    if (!selectedPatient) return;
    
    setAiProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setSelectedPatient({
        ...selectedPatient,
        triageScore: 14,
        triageLevel: 'Urgent',
        aiConfidence: 0.91,
        riskFactors: ['Possible concussion', 'Dehydration']
      });
      setAiProcessing(false);
    }, 2000);
  };
  
  const getVitalStatusColor = (vital: string, value: number | string): string => {
    if (vital === 'heartRate') {
      const hr = value as number;
      if (hr < 60 || hr > 100) return 'text-red-500';
      if (hr < 70 || hr > 90) return 'text-yellow-500';
      return 'text-green-500';
    }
    
    if (vital === 'oxygenSaturation') {
      const os = value as number;
      if (os < 90) return 'text-red-500';
      if (os < 95) return 'text-yellow-500';
      return 'text-green-500';
    }
    
    if (vital === 'temperature') {
      const temp = value as number;
      if (temp < 36 || temp > 38) return 'text-red-500';
      if (temp < 36.5 || temp > 37.5) return 'text-yellow-500';
      return 'text-green-500';
    }
    
    return 'text-gray-700';
  };
  
  const getTriageLevelColor = (level?: string) => {
    switch (level) {
      case 'Immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'Urgent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Delayed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AI Triage System</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients Waiting for Triage */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-blue-600 text-white font-medium">
            Patients Waiting for Triage
          </div>
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
            {triagePatients.map((patient) => (
              <div 
                key={patient.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
                    <p className="text-xs text-gray-500">{patient.age} yrs, {patient.gender}</p>
                  </div>
                  {patient.triageLevel ? (
                    <span className={`px-2 py-1 text-xs rounded-full ${getTriageLevelColor(patient.triageLevel)}`}>
                      {patient.triageLevel}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      Pending
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 truncate">{patient.chiefComplaint}</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Arrived: {patient.arrivalTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Patient Details and Triage Assessment */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedPatient.age} years, {selectedPatient.gender} • ID: {selectedPatient.id}
                    </p>
                  </div>
                  {selectedPatient.triageLevel ? (
                    <div className={`px-4 py-2 rounded-md border ${getTriageLevelColor(selectedPatient.triageLevel)}`}>
                      <div className="text-sm font-medium">{selectedPatient.triageLevel}</div>
                      <div className="text-xs">Score: {selectedPatient.triageScore}</div>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                      onClick={handleRunAITriage}
                      disabled={aiProcessing}
                    >
                      {aiProcessing ? 'Processing...' : 'Run AI Triage'}
                    </button>
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Chief Complaint</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.chiefComplaint}</p>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Arrival Time</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.arrivalTime}</p>
                </div>
              </div>
              
              {/* Vital Signs */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart size={18} className={getVitalStatusColor('heartRate', selectedPatient.vitals.heartRate)} />
                      <span className="ml-2 text-sm font-medium text-gray-700">Heart Rate</span>
                    </div>
                    <p className={`mt-1 text-lg font-semibold ${getVitalStatusColor('heartRate', selectedPatient.vitals.heartRate)}`}>
                      {selectedPatient.vitals.heartRate} <span className="text-xs font-normal">bpm</span>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Activity size={18} className="text-gray-700" />
                      <span className="ml-2 text-sm font-medium text-gray-700">Blood Pressure</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedPatient.vitals.bloodPressure} <span className="text-xs font-normal">mmHg</span>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Thermometer size={18} className={getVitalStatusColor('temperature', selectedPatient.vitals.temperature)} />
                      <span className="ml-2 text-sm font-medium text-gray-700">Temperature</span>
                    </div>
                    <p className={`mt-1 text-lg font-semibold ${getVitalStatusColor('temperature', selectedPatient.vitals.temperature)}`}>
                      {selectedPatient.vitals.temperature} <span className="text-xs font-normal">°C</span>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Droplet size={18} className={getVitalStatusColor('oxygenSaturation', selectedPatient.vitals.oxygenSaturation)} />
                      <span className="ml-2 text-sm font-medium text-gray-700">O₂ Saturation</span>
                    </div>
                    <p className={`mt-1 text-lg font-semibold ${getVitalStatusColor('oxygenSaturation', selectedPatient.vitals.oxygenSaturation)}`}>
                      {selectedPatient.vitals.oxygenSaturation}% <span className="text-xs font-normal">SpO₂</span>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Lungs size={18} className="text-gray-700" />
                      <span className="ml-2 text-sm font-medium text-gray-700">Respiratory Rate</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedPatient.vitals.respiratoryRate} <span className="text-xs font-normal">breaths/min</span>
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Zap size={18} className="text-gray-700" />
                      <span className="ml-2 text-sm font-medium text-gray-700">Pain Level</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedPatient.vitals.painLevel}/10
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Brain size={18} className="text-gray-700" />
                      <span className="ml-2 text-sm font-medium text-gray-700">Consciousness</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedPatient.vitals.consciousness}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* AI Triage Results */}
              {selectedPatient.triageLevel && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">AI Triage Assessment</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">AI Confidence:</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            (selectedPatient.aiConfidence || 0) > 0.9 ? 'bg-green-500' : 
                            (selectedPatient.aiConfidence || 0) > 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(selectedPatient.aiConfidence || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {Math.round((selectedPatient.aiConfidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Triage Level</h4>
                      <div className={`mt-1 inline-block px-3 py-1 rounded-md ${getTriageLevelColor(selectedPatient.triageLevel)}`}>
                        {selectedPatient.triageLevel}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Risk Factors Identified</h4>
                      <ul className="mt-1 space-y-1">
                        {selectedPatient.riskFactors?.map((risk, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle size={16} className="text-yellow-500 mr-2 mt-0.5" />
                            <span className="text-sm text-gray-900">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Recommended Actions</h4>
                      <ul className="mt-1 space-y-1">
                        {selectedPatient.triageLevel === 'Immediate' && (
                          <>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Immediate medical attention required</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Prepare emergency response team</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Notify specialist on call</span>
                            </li>
                          </>
                        )}
                        
                        {selectedPatient.triageLevel === 'Urgent' && (
                          <>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Attend within 30 minutes</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Monitor vital signs every 15 minutes</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Prepare for diagnostic imaging</span>
                            </li>
                          </>
                        )}
                        
                        {selectedPatient.triageLevel === 'Delayed' && (
                          <>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Can wait up to 2 hours for treatment</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Reassess if condition changes</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-900">Provide pain management if needed</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      Override Assessment
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Confirm & Proceed
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-64">
              <div className="text-gray-400 mb-4">
                <Activity size={48} />
              </div>
              <p className="text-gray-500 text-center">Select a patient to view details and perform AI triage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Triage;