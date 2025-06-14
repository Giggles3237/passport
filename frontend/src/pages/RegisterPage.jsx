import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import bmwLogo from '../assets/bmw-logo.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const RegisterPage = () => {
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
        Cookies.set('user_id', data.user_id, { expires: 365 });
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error');
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#fff' }}>
        <img src={bmwLogo} alt="BMW Logo" style={{ width: 100, marginBottom: 24 }} />
        <h1 style={{ color: '#1c69d4' }}>Thank you for registering!</h1>
        <p style={{ fontSize: 18 }}>Your digital passport is now linked to your name and email.</p>
      </div>
    );
  }

  // If both name and email are already collected, show a message and hide the form
  if (form.name && form.email) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#fff' }}>
        <img src={bmwLogo} alt="BMW Logo" style={{ width: 100, marginBottom: 24 }} />
        <h2 style={{ color: '#1c69d4' }}>You're all set!</h2>
        <p style={{ fontSize: 18 }}>We already have your name and email. Thank you for participating!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <img src={bmwLogo} alt="BMW Logo" style={{ width: 80, display: 'block', margin: '0 auto 24px' }} />
      <h2 style={{ color: '#1c69d4', textAlign: 'center' }}>Register Your Passport</h2>
      <form onSubmit={handleSubmit}>
        {!form.name && (
          <>
            <label style={{ display: 'block', marginBottom: 8 }}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
          </>
        )}
        {!form.email && (
          <>
            <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
          </>
        )}
        <button type="submit" style={{ width: '100%', background: '#1c69d4', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16 }}>Register</button>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage; 