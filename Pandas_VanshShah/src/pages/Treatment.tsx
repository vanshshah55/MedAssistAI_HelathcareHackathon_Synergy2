import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Stethoscope, 
  Pill, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Clipboard, 
  Zap 
} from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  purpose: string;
  interactions?: string[];
  contraindications?: string[];
}

interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  confidence: number;
  medications: Medication[];
  procedures: string[];
  notes: string;
  createdAt: string;
  aiGenerated: boolean;
}

const Treatment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [showInteractions, setShowInteractions] = useState(false);
  
  // Mock treatment plans data
  const treatmentPlans: TreatmentPlan[] = [
    {
      id: 'TP001',
      patientId: '101',
      patientName: 'Thomas Anderson',
      diagnosis: 'Acute Myocardial Infarction',
      confidence: 0.94,
      medications: [
        {
          name: 'Aspirin',
          dosage: '325 mg',
          frequency: 'Once',
          route: 'Oral',
          purpose: 'Antiplatelet',
          interactions: ['NSAIDs', 'Warfarin', 'Clopidogrel'],
          contraindications: ['Active peptic ulcer', 'Bleeding disorders']
        },
        {
          name: 'Nitroglycerin',
          dosage: '0.4 mg',
          frequency: 'Every 5 min as needed',
          route: 'Sublingual',
          purpose: 'Vasodilation',
          interactions: ['Sildenafil', 'Tadalafil'],
          contraindications: ['Hypotension', 'Right ventricular infarction']
        },
        {
          name: 'Morphine',
          dosage: '2-4 mg',
          frequency: 'Every 5-15 min as needed',
          route: 'IV',
          purpose: 'Pain relief',
          interactions: ['Benzodiazepines', 'Other opioids'],
          contraindications: ['Respiratory depression', 'Hypotension']
        }
      ],
      procedures: [
        'Continuous ECG monitoring',
        'Oxygen therapy if saturation < 94%',
        'Percutaneous Coronary Intervention (PCI) within 90 minutes',
        'Serial cardiac enzyme measurements'
      ],
      notes: 'Patient presents with classic symptoms of acute MI. Immediate cardiology consult recommended. Monitor for arrhythmias and hemodynamic instability.',
      createdAt: '2025-06-10 10:45 AM',
      aiGenerated: true
    },
    {
      id: 'TP002',
      patientId: '102',
      patientName: 'Maria Garcia',
      diagnosis: 'Acute Gastroenteritis',
      confidence: 0.88,
      medications: [
        {
          name: 'Ondansetron',
          dosage: '4 mg',
          frequency: 'Every 8 hours as needed',
          route: 'Oral',
          purpose: 'Antiemetic',
          interactions: ['QT-prolonging medications'],
          contraindications: ['QT prolongation', 'Hypersensitivity']
        },
        {
          name: 'IV Fluids',
          dosage: '1000 mL',
          frequency: 'Over 2 hours, then reassess',
          route: 'IV',
          purpose: 'Rehydration',
          contraindications: ['Fluid overload', 'Heart failure']
        }
      ],
      procedures: [
        'Fluid intake and output monitoring',
        'Electrolyte panel',
        'Stool culture if symptoms persist > 3 days'
      ],
      notes: 'Likely viral gastroenteritis based on symptoms and local outbreak. Focus on hydration and symptom management.',
      createdAt: '2025-06-10 11:15 AM',
      aiGenerated: true
    },
    {
      id: 'TP003',
      patientId: '103',
      patientName: 'James Wilson',
      diagnosis: 'Grade 2 Ankle Sprain',
      confidence: 0.96,
      medications: [
        {
          name: 'Ibuprofen',
          dosage: '600 mg',
          frequency: 'Every 6 hours as needed',
          route: 'Oral',
          purpose: 'Pain and inflammation',
          interactions: ['Aspirin', 'Warfarin', 'ACE inhibitors'],
          contraindications: ['Peptic ulcer disease', 'Renal impairment']
        }
      ],
      procedures: [
        'RICE protocol (Rest, Ice, Compression, Elevation)',
        'Ankle X-ray to rule out fracture',
        'Elastic bandage application',
        'Crutches for 3-5 days'
      ],
      notes: 'Moderate ankle sprain with lateral ligament involvement. No signs of fracture on physical exam. Follow up with orthopedics if not improving within 7 days.',
      createdAt: '2025-06-10 11:30 AM',
      aiGenerated: true
    }
  ];
  
  const filteredPlans = treatmentPlans.filter(plan => 
    plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePlanSelect = (plan: TreatmentPlan) => {
    setSelectedPlan(plan);
    setShowInteractions(false);
  };
  
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AI Treatment Guidance</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          New Treatment Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treatment Plans List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by patient or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPlan?.id === plan.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{plan.patientName}</h3>
                    <p className="text-xs text-gray-500">ID: {plan.patientId}</p>
                  </div>
                  {plan.aiGenerated && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                      <Zap size={12} className="mr-1" />
                      AI
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-800">{plan.diagnosis}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{plan.createdAt}</span>
                  <span className={`flex items-center ${getConfidenceColor(plan.confidence)}`}>
                    <CheckCircle size={12} className="mr-1" />
                    {Math.round(plan.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ))}
            
            {filteredPlans.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No treatment plans found matching your search.
              </div>
            )}
          </div>
        </div>
        
        {/* Treatment Plan Details */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <div className="space-y-6">
              {/* Plan Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPlan.diagnosis}</h2>
                    <p className="text-sm text-gray-600">
                      Patient: {selectedPlan.patientName} • ID: {selectedPlan.patientId}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center ${getConfidenceColor(selectedPlan.confidence)}`}>
                      <span className="text-sm font-medium mr-1">AI Confidence:</span>
                      <span className="font-bold">{Math.round(selectedPlan.confidence * 100)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Created: {selectedPlan.createdAt}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                    <Clipboard size={16} className="mr-1" />
                    Apply Plan
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                    <FileText size={16} className="mr-1" />
                    Edit Plan
                  </button>
                </div>
              </div>
              
              {/* Medications */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Pill size={20} className="text-blue-500 mr-2" />
                    Recommended Medications
                  </h3>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => setShowInteractions(!showInteractions)}
                  >
                    {showInteractions ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Hide Interactions
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        Show Interactions
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {selectedPlan.medications.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">{med.name}</h4>
                          <p className="text-sm text-gray-600">{med.purpose}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{med.dosage}</p>
                          <p className="text-sm text-gray-600">{med.route}, {med.frequency}</p>
                        </div>
                      </div>
                      
                      {showInteractions && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {med.interactions && med.interactions.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Potential Interactions:</p>
                              <div className="flex flex-wrap gap-1">
                                {med.interactions.map((interaction, i) => (
                                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                                    <AlertTriangle size={10} className="mr-1" />
                                    {interaction}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {med.contraindications && med.contraindications.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Contraindications:</p>
                              <div className="flex flex-wrap gap-1">
                                {med.contraindications.map((contraindication, i) => (
                                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
                                    <XCircle size={10} className="mr-1" />
                                    {contraindication}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Procedures */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <Stethoscope size={20} className="text-blue-500 mr-2" />
                  Recommended Procedures
                </h3>
                
                <ul className="space-y-2">
                  {selectedPlan.procedures.map((procedure, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-900">{procedure}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Clinical Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <FileText size={20} className="text-blue-500 mr-2" />
                  Clinical Notes
                </h3>
                
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedPlan.notes}</p>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  Request Second Opinion
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Approve & Document
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-64">
              <div className="text-gray-400 mb-4">
                <Stethoscope size={48} />
              </div>
              <p className="text-gray-500 text-center">Select a treatment plan to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Treatment;