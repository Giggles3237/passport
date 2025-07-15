import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API_URL}/admin/stats`);
        const statsData = await statsRes.json();
        const regRes = await fetch(`${API_URL}/admin/registrants`);
        const regData = await regRes.json();
        setStats(statsData);
        setRegistrants(regData.users);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch admin data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading admin data...</div>;
  if (error) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee', color: '#000' }}>
      <h1 style={{ color: '#1c69d4', marginBottom: 24 }}>Admin Dashboard</h1>
      <p style={{ fontSize: 14, color: '#1c69d4', fontWeight: 'bold', marginBottom: 24 }}>
        Contest progress overview
      </p>
      <h2 style={{ color: '#222', fontSize: 22, marginBottom: 16 }}>Stats</h2>
      <ul style={{ fontSize: 18, marginBottom: 24, color: '#000' }}>
        <li><strong>Total Users:</strong> {stats.user_count}</li>
        <li><strong>Total Stamps:</strong> {stats.stamp_count}</li>
        <li><strong>Total Locations:</strong> {stats.location_count}</li>
      </ul>
      <h3 style={{ color: '#1c69d4', fontSize: 20, marginTop: 24 }}>Stamps Per Location</h3>
      <table style={{ width: '100%', marginBottom: 24, borderCollapse: 'collapse', color: '#000' }}>
        <thead>
          <tr style={{ background: '#f4f8fb' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Location</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Stamps</th>
          </tr>
        </thead>
        <tbody>
          {stats.stamps_per_location.map(loc => (
            <tr key={loc.id}>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{loc.name}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{loc.stamp_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
              <td style={{ padding: 8, border: '1px solid #eee' }}>{row.date}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ color: '#222', fontSize: 22, margin: '32px 0 16px' }}>Registrants</h2>
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
              <td style={{ padding: 8, border: '1px solid #eee' }}>{user.created_at}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{user.store_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage; 