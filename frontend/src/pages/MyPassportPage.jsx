import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setCookieIfConsented } from '../cookieUtils';
import bmwLogo from '../assets/bmw-logo.svg';

const STAMP_IMAGES = {
  Lawrenceville: '/assets/stamps/lawrenceville.svg',
  'Strip District': '/assets/stamps/strip_district.svg',
  Downtown: '/assets/stamps/downtown.svg',
  Bloomfield: '/assets/stamps/bloomfield.svg',
  Shadyside: '/assets/stamps/shadyside.svg',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const MyPassportPage = () => {
  const [user, setUser] = useState(null);
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState(Cookies.get('first_name') || '');

  useEffect(() => {
    const user_id = Cookies.get('user_id');
    if (!user_id) {
      setError('User information not found.');
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/user/${user_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data.user);
          setStamps(data.stamps);
          if (!firstName && data.user && data.user.name) {
            const fn = data.user.name.split(' ')[0];
            setFirstName(fn);
            setCookieIfConsented('first_name', fn, { expires: 365 });
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, []);

  // Read all stamp cookies
  const collectedStamps = Object.keys(Cookies.get())
    .filter(key => key.startsWith('stamp_location_'))
    .map(key => key.replace('stamp_location_', ''));

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <img src={bmwLogo} alt="BMW Logo" style={{ width: 80, display: 'block', margin: '0 auto 24px' }} />
      <h2 style={{ color: '#1c69d4', textAlign: 'center' }}>My BMW Digital Passport</h2>
      <p style={{ fontSize: 16, color: '#1c69d4', fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        Collect all five stamps to be entered in the BMW contest!
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <>
          <p style={{ color: 'red' }}>{error}</p>
          <h3 style={{ color: '#1c69d4' }}>Collected Stamps</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {collectedStamps.length === 0 && <li>No stamps collected yet.</li>}
            {collectedStamps.map(id => (
              <li key={id} style={{ marginBottom: 12, padding: 8, background: '#f4f8fb', borderRadius: 6 }}>
                <span role="img" aria-label="stamp">📍</span> Location {id}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {firstName && (
            <div style={{ fontSize: 22, color: '#1c69d4', textAlign: 'center', marginBottom: 16 }}>
              Welcome back, {firstName}!
            </div>
          )}
          <div style={{ marginBottom: 24 }}>
            <strong>Name:</strong> {firstName || user?.name}<br />
            <strong>Email:</strong> {user?.email}<br />
            <strong>Store ID:</strong> {user?.store_id}
          </div>
          <h3 style={{ color: '#1c69d4' }}>Collected Stamps</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {collectedStamps.length === 0 && <li>No stamps collected yet.</li>}
            {collectedStamps.map(id => {
              const dbStamp = stamps.find(s => String(s.location_id) === id);
              const imgSrc = dbStamp ? STAMP_IMAGES[dbStamp.location_name] : null;
              return (
                <li
                  key={id}
                  style={{
                    marginBottom: 12,
                    padding: 8,
                    background: '#f4f8fb',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={dbStamp.location_name}
                      style={{ width: 80 }}
                    />
                  )}
                  <div>
                    <strong>{dbStamp ? dbStamp.location_name : `Location ${id}`}</strong>
                    {dbStamp && dbStamp.timestamp && (
                      <div style={{ fontSize: 12, color: '#888' }}>
                        Visited: {new Date(dbStamp.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default MyPassportPage; 