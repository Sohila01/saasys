
import React from 'react';
// Split imports: Router from react-router-dom, core logic components from react-router
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import DashboardPage from './pages/Dashboard';
import GenericModulePage from './pages/GenericModule';
import SchemaBuilderPage from './pages/Admin/SchemaBuilder';
import DashboardBuilderPage from './pages/Admin/DashboardBuilder';
import TenantSettingsPage from './pages/Admin/TenantSettings';
import SecurityAuditPage from './pages/Admin/SecurityAudit';
import SystemEnginePage from './pages/Admin/SystemEngine';
import WorkflowBuilderPage from './pages/Admin/WorkflowBuilder';
import SupplierProfilePage from './pages/SupplierProfile';
import LoginPage from './pages/Auth/Login';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="mesh-gradient h-16 w-16 rounded-[2rem] animate-spin mb-8"></div>
        <p className="text-white font-black text-xs uppercase tracking-[0.4em] animate-pulse">Initializing Nexus Cluster...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<LoginPage onLogin={(email,password) => login(email,password)} />} />
        ) : (
          <Route
            path="/*"
            element={
              <div className="flex h-screen bg-transparent overflow-hidden">
                <Sidebar user={user} />
                <div className="flex-1 flex flex-col overflow-hidden relative border-l border-white/5">
                  <Header user={user} />
                  <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 relative z-10 custom-scrollbar">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/modules/:code" element={<GenericModulePage />} />
                      <Route path="/admin/schema" element={<SchemaBuilderPage />} />
                      <Route path="/admin/dashboard" element={<DashboardBuilderPage />} />
                      <Route path="/admin/workflows" element={<WorkflowBuilderPage />} />
                      <Route path="/admin/settings" element={<TenantSettingsPage />} />
                      <Route path="/admin/security" element={<SecurityAuditPage />} />
                      <Route path="/admin/system" element={<SystemEnginePage />} />
                      <Route path="/supplier/profile" element={<SupplierProfilePage />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
};

export default App;
