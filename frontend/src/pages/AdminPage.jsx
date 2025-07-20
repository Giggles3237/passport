import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showRegistrants, setShowRegistrants] = useState(false);

  // Simple password check - you can change this to any password you want
  const ADMIN_PASSWORD = 'BMW2024!';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setError('Incorrect password');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API_URL}/admin/stats`);
        const statsData = await statsRes.json();
        const regRes = await fetch(`${API_URL}/admin/registrants`);
        const regData = await regRes.json();
        setStats(statsData);
        setRegistrants(regData.users);
        setLoading(false);
      } catch {
        setError('Failed to fetch admin data');
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Format date to remove time
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Registered', 'Store ID'];
    const csvContent = [
      headers.join(','),
      ...registrants.map(user => [
        `"${user.name}"`,
        `"${user.email}"`,
        `"${formatDate(user.created_at)}"`,
        `"${user.store_id}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bmw-contest-registrants-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  // Login form
  if (!isAuthenticated) {
    return (
      <div style={{ 
        maxWidth: 400, 
        margin: '100px auto', 
        background: '#fff', 
        padding: 32, 
        borderRadius: 12, 
        boxShadow: '0 2px 8px #eee' 
      }}>
        <h2 style={{ color: '#1c69d4', textAlign: 'center', marginBottom: 24 }}>
          Admin Access
        </h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: 16
              }}
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#1c69d4',
              color: '#fff',
              padding: 12,
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          {error && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  if (loading) return <div style={{ padding: 32 }}>Loading admin data...</div>;
  if (error) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee', color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1c69d4', margin: 0 }}>Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('admin_authenticated');
            setIsAuthenticated(false);
          }}
          style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Logout
        </button>
      </div>
      <p style={{ fontSize: 14, color: '#1c69d4', fontWeight: 'bold', marginBottom: 24 }}>
        Contest progress overview
      </p>
      <h2 style={{ color: '#222', fontSize: 22, marginBottom: 16 }}>Stats</h2>
      <ul style={{ fontSize: 18, marginBottom: 24, color: '#000' }}>
        <li><strong>Total Users:</strong> {stats.user_count}</li>
        <li><strong>Total Locations:</strong> {stats.location_count}</li>
        <li><strong>Total Visits:</strong> {stats.visit_count || 0}</li>
        <li><strong>Unique Visitors:</strong> {stats.unique_visitors || 0}</li>
      </ul>
      {stats.visits_per_location && (
        <>
          <h3 style={{ color: '#1c69d4', fontSize: 20, marginTop: 24 }}>Visits Per Location</h3>
          <table style={{ width: '100%', marginBottom: 24, borderCollapse: 'collapse', color: '#000' }}>
            <thead>
              <tr style={{ background: '#f4f8fb' }}>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Location</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Total Visits</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Unique Visitors</th>
              </tr>
            </thead>
            <tbody>
              {stats.visits_per_location.map(loc => (
                <tr key={loc.id}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{loc.name}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{loc.visit_count}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{loc.unique_visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {stats.visits_per_date && (
        <>
          <h3 style={{ color: '#1c69d4', fontSize: 20, marginTop: 24 }}>Visits Per Day (Last 30 Days)</h3>
          <table style={{ width: '100%', marginBottom: 24, borderCollapse: 'collapse', color: '#000' }}>
            <thead>
              <tr style={{ background: '#f4f8fb' }}>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
                <th style={{ padding: 8, border: '1px solid #eee' }}>Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.visits_per_date.map(row => (
                <tr key={row.date}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{formatDate(row.date)}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <h3 style={{ color: '#1c69d4', fontSize: 20, marginTop: 24 }}>Users Per Registration Date</h3>
      <table style={{ width: '100%', marginBottom: 24, borderCollapse: 'collapse', color: '#000' }}>
        <thead>
          <tr style={{ background: '#f4f8fb' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Registrations</th>
          </tr>
        </thead>
        <tbody>
          {stats.users_per_date.map(row => (
            <tr key={row.date}>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{formatDate(row.date)}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '32px 0 16px' }}>
        <h2 style={{ color: '#222', fontSize: 22, margin: 0 }}>Registrants ({registrants.length})</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowRegistrants(!showRegistrants)}
            style={{
              background: showRegistrants ? '#6c757d' : '#1c69d4',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 'bold'
            }}
          >
            {showRegistrants ? 'Hide Registrants' : 'Show Registrants'}
          </button>
          <button
            onClick={exportToCSV}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 'bold'
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
      {showRegistrants && (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000' }}>
          <thead>
            <tr style={{ background: '#f4f8fb' }}>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Name</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Email</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Registered</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Store ID</th>
            </tr>
          </thead>
          <tbody>
            {registrants.map(user => (
              <tr key={user.id}>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{user.name}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{user.email}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{formatDate(user.created_at)}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{user.store_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage; 