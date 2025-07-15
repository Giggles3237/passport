import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setCookieIfConsented } from '../cookieUtils';
import bmwLogo from '../assets/bmw-logo.svg';

const LOTTIE_MAP = {
  Lawrenceville: '/assets/lotties/Lawrenceville Stamp.json',
  'Strip District': '/assets/lotties/Strip District Stamp.json',
  Downtown: '/assets/lotties/Downtown Stamp.json',
  Bloomfield: '/assets/lotties/Bloomfield Stamp.json',
  Shadyside: '/assets/lotties/Shadyside Stamp.json',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const PassportStampAnimation = ({ onDone, src }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <lottie-player
        autoplay
        src={src || '/assets/images/visa_lottie'}
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

const LocationPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [showAnimation, setShowAnimation] = useState(() => !Cookies.get(`stamp_location_${id}`));
  const [showFirstNamePrompt, setShowFirstNamePrompt] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [firstName, setFirstName] = useState(Cookies.get('first_name') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    setShowAnimation(!Cookies.get(`stamp_location_${id}`));
  }, [id]);

  useEffect(() => {
    if (id) {
      // Fetch location info and set cookies
      fetch(`${API_URL}/location/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setLocation(data);
            setCookieIfConsented(`stamp_location_${id}`, 'true', { expires: 365 });
            if (data.store_id) {
              setCookieIfConsented('store_id', data.store_id, { expires: 365 });
            }
          }
        })
        .catch(() => setError('Network error'));
    }
  }, [id]);

  useEffect(() => {
    if (!showAnimation) {
      // Count unique stamps
      const stampCount = Object.keys(Cookies.get()).filter(k => k.startsWith('stamp_location_')).length;
      if (!firstName && (stampCount === 2)) {
        setShowFirstNamePrompt(true);
      } else if (!email && (stampCount === 4 || stampCount === 5)) {
        setShowEmailPrompt(true);
      }
    }
  }, [showAnimation, firstName, email]);

  const handleFirstNameSubmit = (e) => {
    e.preventDefault();
    if (firstNameInput.trim()) {
      setCookieIfConsented('first_name', firstNameInput.trim(), { expires: 365 });
      setFirstName(firstNameInput.trim());
      setShowFirstNamePrompt(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setCookieIfConsented('email', emailInput.trim(), { expires: 365 });
      setEmail(emailInput.trim());
      setShowEmailPrompt(false);
      // Register user
      const name = Cookies.get('first_name');
      const email = emailInput.trim();
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, store_id: 1 }),
          credentials: 'include',
        });
        const data = await res.json();
        if (data.user_id) {
          setCookieIfConsented('user_id', data.user_id, { expires: 365 });
        }
      } catch {}
    }
  };

  if (error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', minHeight: '100vh' }}>
      {showAnimation && (
        <PassportStampAnimation
          onDone={() => setShowAnimation(false)}
          src={location ? LOTTIE_MAP[location.name] : undefined}
        />
      )}
      {!showAnimation && (
        <>
          <img src={bmwLogo} alt="BMW Logo" style={{ width: 100, marginBottom: 24 }} />
          <h1 style={{ color: '#1c69d4', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {location ? `Welcome to ${location.name}!` : 'Loading...'}
          </h1>
          {firstName && <div style={{ fontSize: 22, color: '#1c69d4', marginBottom: 12 }}>Welcome back, {firstName}!</div>}
          <p style={{ fontSize: 18 }}>You just collected a digital stamp for your passport.</p>
          <p style={{ color: '#888' }}>Scan more QR codes at other locations to collect more stamps.</p>
          <p style={{ color: '#1c69d4', fontWeight: 'bold' }}>
            Complete your passport for a chance to win our BMW contest!
          </p>
        </>
      )}
      {/* First Name Prompt */}
      {showFirstNamePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.97)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleFirstNameSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee', textAlign: 'center' }}>
            <h2 style={{ color: '#1c69d4' }}>So, you have visited us a couple of times, we should really be on a first name basis. What's yours?</h2>
            <label style={{ fontSize: 18 }}>What's your first name?</label>
            <input value={firstNameInput} onChange={e => setFirstNameInput(e.target.value)} required style={{ width: '100%', margin: '16px 0', padding: 8, fontSize: 16 }} />
            <button type="submit" style={{ background: '#1c69d4', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16 }}>Continue</button>
          </form>
        </div>
      )}
      {/* Email Prompt */}
      {showEmailPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.97)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleEmailSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee', textAlign: 'center' }}>
            <h2 style={{ color: '#1c69d4' }}>Let's stay in touch!</h2>
            <label style={{ fontSize: 18 }}>What's your email address?</label>
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required style={{ width: '100%', margin: '16px 0', padding: 8, fontSize: 16 }} />
            <button type="submit" style={{ background: '#1c69d4', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16 }}>Continue</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LocationPage; 