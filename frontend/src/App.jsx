import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import API from './api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MachineDetails from './pages/MachineDetails';
import Alerts from './pages/Alerts';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClickSpark from './components/ClickSpark';

// Protected Layout component to guard auth states
const ProtectedLayout = ({ machines }) => {
  const isAuthenticated = localStorage.getItem('sentinel_user') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 relative">
      {/* Global Navbar */}
      <Navbar machines={machines} />

      <div className="flex flex-1 pt-16">
        {/* Global Sidebar */}
        <Sidebar />

        {/* Main Workspace Area */}
        <main className="flex-1 sm:pl-64 p-6 overflow-y-auto min-h-[calc(100vh-4rem)] z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [machines, setMachines] = useState([]);

  // Poll machines to update global navbar indicators
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await API.get('/machine');
        setMachines(res.data?.data || []);
      } catch (err) {
        console.error(err);
        if (err.message) console.error(err.message);
        if (err.response) {
          console.error(err.response);
          console.error(err.response.status);
          console.error(err.response.data);
        }
      }
    };

    fetchMachines();
    const interval = setInterval(fetchMachines, 3001);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <ClickSpark
        sparkColor="#3b82f6"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
      >
        <Routes>
          {/* Public Landing & Auth pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected telemetry console views */}
          <Route element={<ProtectedLayout machines={machines} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/machine" element={<MachineDetails />} />
            <Route path="/alerts" element={<Alerts />} />
          </Route>

          {/* Redirect arbitrary navigation to landing console */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ClickSpark>
    </Router>
  );
}

export default App;
