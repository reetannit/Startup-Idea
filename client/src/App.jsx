import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SubmitIdea from './pages/SubmitIdea';
import IdeaDetail from './pages/IdeaDetail';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitIdea />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 4000,
            style: {
              background: '#161b22',
              color: '#f0f6fc',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem'
            }
          }}
        />
      </div>
    </BrowserRouter>
  );
}
