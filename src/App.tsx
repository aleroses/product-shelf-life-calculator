import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { AppHeader } from './components/layout/AppHeader';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductForm } from './components/ProductForm';
import { HistoryTable } from './components/history/HistoryTable';
import { ChartsSection } from './components/charts/ChartsSection';
import { WelcomeModal } from './components/modals/WelcomeModal';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { ToastProvider } from './components/ui/ToastProvider';
import './App.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppProvider>
      <div className="app">
        <AnimatedBackground />
        <AppHeader onOpenSettings={() => setSettingsOpen(true)} />
        <main className="app-main">
          <section id="calculadora" className="calculator-section page-section">
            <h2 className="section-title">Calculadora</h2>
            <ProductForm />
          </section>
          <HistoryTable />
          <Dashboard />
          <ChartsSection />
        </main>
        <footer className="app-footer">
          <p>© 2026 AeroShelf — Sistema de Monitoreo y Gestión de Vida Útil de Productos</p>
          <p className="app-footer__credit">
            Desarrollado por{' '}
            <a
              href="https://github.com/aleroses"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ale Roses
            </a>
          </p>
        </footer>
        <ScrollToTopButton />
        <WelcomeModal />
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
        <ToastProvider />
      </div>
    </AppProvider>
  );
}

export default App;
