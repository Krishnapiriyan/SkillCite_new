import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employers from './pages/Employers';
import EmployerDetail from './pages/Employers/EmployerDetail';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/Candidates/CandidateDetail';
import Engineering from './pages/Engineering';
import EngineeringDetail from './pages/Engineering/EngineeringDetail';
import Contacts from './pages/Contacts';
import CMS from './pages/CMS';
import Profile from './pages/Profile';

// Protected Route Wrapper Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#090E1A] gap-6 select-none relative overflow-hidden">
        {/* Dynamic Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[130px] animate-pulse [animation-duration:8s]" />
        
        {/* Spinner Panel */}
        <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">SkillCite Intake</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employers" 
        element={
          <ProtectedRoute>
            <Employers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employers/:id" 
        element={
          <ProtectedRoute>
            <EmployerDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidates" 
        element={
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidates/:id" 
        element={
          <ProtectedRoute>
            <CandidateDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/engineering" 
        element={
          <ProtectedRoute>
            <Engineering />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/engineering/:id" 
        element={
          <ProtectedRoute>
            <EngineeringDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contacts" 
        element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cms" 
        element={
          <ProtectedRoute>
            <CMS />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Wildcard Fallback redirects to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
