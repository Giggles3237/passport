import React from 'react';
import Cookies from 'js-cookie';
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
  // Simplified - no user data needed, just show stamps

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
          Collect all five!
        </p>
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', margin: '16px 0' }}>
              {collectedStamps.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                  <p>No stamps collected yet.</p>
                  <p style={{ fontSize: 14, marginTop: 8 }}>Visit different neighborhoods to collect stamps!</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    {collectedStamps.map(slug => {
                      const displayName = SLUG_TO_NAME[slug] || slug.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                      const svgPath = `/assets/stamps/${slug}.svg`;
                      return (
                        <div
                          key={slug}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 8,
                            padding: 12,
                            background: '#f4f8fb',
                            borderRadius: 8,
                            border: '2px solid #1c69d4',
                            minWidth: 120
                          }}
                        >
                          <img
                            src={svgPath}
                            alt={displayName}
                            style={{ width: 80, height: 32, objectFit: 'contain' }}
                          />
                          <span style={{ fontSize: 12, color: '#1c69d4', fontWeight: 'bold', textAlign: 'center' }}>
                            {displayName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <p style={{ color: '#1c69d4', fontWeight: 'bold' }}>
                      {collectedStamps.length} of 5 stamps collected
                    </p>
                    {collectedStamps.length === 5 && (
                      <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: 8 }}>
                        🎉 Congratulations! You've collected all stamps!
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
      </div>
    </div>
  );
}

export default MyPassportModal; 