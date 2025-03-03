import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Triage from './pages/Triage';
import Treatment from './pages/Treatment';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated ? (
            <div className="flex h-screen overflow-hidden">
              <Sidebar open={sidebarOpen} />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/triage" element={<Triage />} />
                    <Route path="/treatment" element={<Treatment />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;