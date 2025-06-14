import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NeighborhoodPage from './pages/NeighborhoodPage';
import RegisterPage from './pages/RegisterPage';
import MyPassportPage from './pages/MyPassportPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/location/:slug" element={<NeighborhoodPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-passport" element={<MyPassportPage />} />
        <Route path="*" element={<Navigate to="/location/lawrenceville" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
