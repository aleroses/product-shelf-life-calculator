import { AppProvider } from './context/AppContext';
import { ProductForm } from './components/ProductForm';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Calculadora de Vida Útil</h1>
          <ThemeToggle />
        </header>
        <main className="app-main">
          <ProductForm />
        </main>
        <footer className="app-footer">
          <p>Control de bodega y gestión de inventarios</p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
