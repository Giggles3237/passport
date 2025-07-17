import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setCookieIfConsented } from '../cookieUtils';
import logo from '../assets/logo.svg';

const STAMP_IMAGES = {
  Lawrenceville: '/assets/stamps/lawrenceville.svg',
  'Strip District': '/assets/stamps/strip_district.svg',
  Downtown: '/assets/stamps/downtown.svg',
  Bloomfield: '/assets/stamps/bloomfield.svg',
  Shadyside: '/assets/stamps/shadyside.svg',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const BLUE = '#1c69d4';

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
  maxWidth: 500,
  width: '90vw',
  padding: 32,
  position: 'relative',
};

function MyPassportModal({ onClose }) {
  const [user, setUser] = useState(null);
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

  // Map slugs to display names
  const SLUG_TO_NAME = {
    lawrenceville: 'Lawrenceville',
    strip_district: 'Strip District',
    downtown: 'Downtown',
    bloomfield: 'Bloomfield',
    shadyside: 'Shadyside',
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
          aria-label="Close passport"
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
        <img src={logo} alt="Logo" style={{ width: 120, display: 'block', margin: '0 auto 24px' }} />
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
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
              {collectedStamps.length === 0 && <span style={{ color: '#888' }}>No stamps collected yet.</span>}
              {collectedStamps.map(slug => {
                const svgPath = `/assets/stamps/${slug}.svg`;
                return (
                  <a
                    key={slug}
                    href={`/location/${slug}`}
                    style={{
                      display: 'inline-block',
                      border: 'none',
                      borderRadius: 6,
                      padding: 2,
                      background: BLUE,
                      transition: 'box-shadow 0.2s',
                    }}
                    title={slug.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  >
                    <img
                      src={svgPath}
                      alt={slug}
                      style={{ width: 110, height: 44, objectFit: 'contain', display: 'block' }}
                    />
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyPassportModal; 