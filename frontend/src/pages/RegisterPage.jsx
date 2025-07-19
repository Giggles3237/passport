import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { setCookieIfConsented } from '../cookieUtils';
import logo from '../assets/logo.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  zIndex: 4000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 16px #0002',
  maxWidth: 400,
  width: '90vw',
  padding: 32,
  position: 'relative',
};

function RegisterModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: Cookies.get('first_name') || '',
      email: Cookies.get('email') || ''
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, store_id: 1 }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setCookieIfConsented('user_id', data.user_id, { expires: 365 });
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error');
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={modalBackdropStyle} onClick={handleBackdropClick}>
      <div style={modalStyle}>
        {/* Close (X) button */}
        <button
          onClick={onClose}
          aria-label="Close registration"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#888',
            cursor: 'pointer',
            fontWeight: 'bold',
            lineHeight: 1
          }}
        >
          ×
        </button>
        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', background: '#fff' }}>
            <img src={logo} alt="Logo" style={{ width: 100, marginBottom: 24 }} />
            <h1 style={{ color: '#1c69d4' }}>Thank You for Entering!</h1>
            <p style={{ fontSize: 18 }}></p>
          </div>
        ) : (
          <>
            <img src={logo} alt="Logo" style={{ width: 120, display: 'block', margin: '0 auto 24px' }} />
            <h2 style={{ color: '#1c69d4', textAlign: 'center' }}>
              Enter to Win
            </h2>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: 8 }}>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
              <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
              <button type="submit" style={{ width: '100%', background: '#1c69d4', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16 }}>Register</button>
              {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
            </form>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <a href="/official-rules" style={{ color: '#1c69d4', textDecoration: 'underline', fontSize: 14 }}>
                Official Rules
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterModal; 