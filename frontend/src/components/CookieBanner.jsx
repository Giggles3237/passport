import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  background: '#1c69d4',
  color: '#fff',
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1000,
};

const btnStyle = {
  background: '#fff',
  color: '#1c69d4',
  border: 'none',
  borderRadius: 4,
  padding: '6px 12px',
  marginLeft: 8,
  fontWeight: 'bold',
  cursor: 'pointer',
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (consent === undefined) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setVisible(false);
  };

  const decline = () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 });
    // remove previously set cookies
    Object.keys(Cookies.get())
      .filter(name =>
        ['first_name', 'email', 'user_id', 'store_id'].includes(name) ||
        name.startsWith('stamp_location_')
      )
      .forEach(name => Cookies.remove(name));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={bannerStyle}>
      <span>
        We use cookies to enhance your experience. You may opt out if you wish.
      </span>
      <div>
        <button style={btnStyle} onClick={decline}>Opt Out</button>
        <button style={btnStyle} onClick={accept}>Accept</button>
      </div>
    </div>
  );
};

export default CookieBanner;
