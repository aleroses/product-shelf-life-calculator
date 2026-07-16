import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomeModal } from './components/WelcomeModal';
import { SettingsModal } from './components/SettingsModal';
import { DashboardStats } from './components/DashboardStats';
import { ProductForm } from './components/ProductForm';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { HistoryTable } from './components/HistoryTable';
import { ToastNotification } from './components/ToastNotification';
import { ThemeToggle } from './components/ThemeToggle';
import { Settings, Shield } from 'lucide-react';
import './App.css';

function AppContent() {
  const { state } = useApp();
  const { user } = state;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="app">
      {/* Fondo Animado de CSS Blobs/Glow */}
      <div className="animated-bg">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      <WelcomeModal />
      
      {user && (
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      <header className="app-header">
        <div className="header-left">
          <Shield className="app-logo-icon" size={22} />
          <h1 className="app-title">AeroShelf</h1>
          <span className="header-subtitle">Control de Calidad</span>
        </div>

        {user && (
          <div className="header-right">
            <ThemeToggle />
            
            <div className="header-user-badge">
              <img 
                src={`/assets/avatars/${user.avatar}`} 
                alt={user.name} 
                className="header-avatar-img"
              />
              <span className="header-user-name">{user.name}</span>
            </div>

            <button 
              type="button" 
              onClick={() => setIsSettingsOpen(true)} 
              className="header-config-btn"
              title="Configuración de Sistema"
            >
              <Settings size={18} />
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {user ? (
          <>
            <DashboardStats />
            <ProductForm />
            <AnalyticsCharts />
            <HistoryTable />
          </>
        ) : (
          <div className="app-loading-placeholder">
            <p>Esperando inicialización del inspector...</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 AeroShelf — Sistema de Monitoreo y Gestión de Vida Útil de Productos</p>
        <a
          href="https://github.com/aleroses"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-dev-link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
          </svg>
          <span>Desarrollado por aleroses</span>
        </a>
      </footer>

      <ToastNotification />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
