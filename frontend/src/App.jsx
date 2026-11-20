import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ThemesPage from './pages/ThemesPage';
import DecorationCatalogPage from './pages/DecorationCatalogPage';
import SelectedDecorationsPage from './pages/SelectedDecorationsPage';

function App() {
  return (
    <BrowserRouter>
      <EventProvider>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ThemesPage />} />
              <Route path="/themes" element={<ThemesPage />} />
              <Route path="/catalog" element={<DecorationCatalogPage />} />
              <Route path="/selected" element={<SelectedDecorationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </EventProvider>
    </BrowserRouter>
  );
}

export default App;
