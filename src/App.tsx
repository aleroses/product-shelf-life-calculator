import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { AppHeader } from './components/layout/AppHeader';
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
          <Dashboard />
          <section className="calculator-section">
            <h2 className="section-title">Calculadora</h2>
            <ProductForm />
          </section>
          <HistoryTable />
          <ChartsSection />
        </main>
        <footer className="app-footer">
          <p>Sistema de control de calidad y vida útil de productos</p>
        </footer>
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
