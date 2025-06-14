import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import bmwLogo from '../assets/bmw-logo.svg';

const NEIGHBORHOODS = {
  lawrenceville: {
    title: 'Lawrenceville',
    hero: '/assets/images/neighborhoods/lawrenceville_hero.jpg',
    tagline: 'Where History Meets Innovation',
    welcome: 'Welcome to Lawrenceville',
    intro: `Discover one of Pittsburgh's oldest and most vibrant neighborhoods, where historic charm meets contemporary creativity. Located less than three miles from Downtown Pittsburgh, Lawrenceville has transformed from its industrial roots into a thriving cultural hub.`,
    featureImg: '/assets/images/neighborhoods/lawrenceville_feature.jpg',
    about: `Founded in 1814 and named after Captain James Lawrence from the War of 1812, Lawrenceville boasts a rich history that spans over two centuries. In 2019, it was designated as a Historic District and added to the National Register of Historic Places, recognizing its architectural significance and cultural heritage. The neighborhood's transformation from industrial center to creative district exemplifies Pittsburgh's own evolution.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Lawrenceville is home to several historic landmarks, including the Allegheny Arsenal, the iconic Doughboy Statue located at the intersection of Butler Street and Penn Avenue, the Carnegie Library - Lawrenceville Branch, and the Stephen Foster House. These sites tell the story of the neighborhood's military, cultural, and social history.`
      },
      {
        title: 'Unique Characteristics',
        text: `With Butler Street and Penn Avenue serving as its main arteries, Lawrenceville has become a haven for artists and creatives. The neighborhood features a vibrant cultural scene with numerous art galleries and studios, a diverse architectural landscape, and a neighborhood center anchored by a bowling alley. The rich mix of restaurants, bars, and retail shops makes it a destination for locals and visitors alike.`
      },
      {
        title: 'BMW Connection',
        text: `Lawrenceville's artistic community aligns perfectly with BMW's design-forward approach. Just as the neighborhood preserves its historic character while embracing innovation, BMW respects its heritage while pushing the boundaries of automotive design and technology. The vibrant street life of Lawrenceville mirrors the dynamic driving experience that BMW is known for—both offering excitement and discovery around every corner.`
      }
    ],
    next: {
      slug: 'strip_district',
      label: 'Continue to Strip District',
      text: `Continue your journey through Pittsburgh's vibrant neighborhoods by heading to the Strip District, where the city's industrial past meets its culinary present.`
    }
  },
  strip_district: {
    title: 'Strip District',
    hero: '/assets/images/neighborhoods/strip_district_hero.jpg',
    tagline: 'Where Industry Meets Culinary Excellence',
    welcome: 'Welcome to the Strip District',
    intro: `Nestled along the Allegheny River, the Strip District is a vibrant neighborhood that perfectly blends Pittsburgh's past, present, and future. Once an industrial incubator that helped establish Pittsburgh as an industrial powerhouse, today it's a bustling hub of markets, restaurants, and cultural attractions.`,
    featureImg: '/assets/images/neighborhoods/strip_district_feature.jpg',
    about: `The Strip District's history is deeply tied to Pittsburgh's industrial heritage. Formerly a center for wholesale businesses due to its proximity to river and rail lines, it attracted immigrants, particularly from Germany, who contributed significantly to its development. Today, the neighborhood has transformed while preserving its historic character, with many buildings dating back to the early 20th century now housing modern businesses.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `The Strip District is home to several significant landmarks, including the Heinz History Center, which celebrates Western Pennsylvania's rich heritage. The neighborhood is also known for its historic buildings that have been preserved and repurposed, and its proximity to other Pittsburgh landmarks like the Duquesne Incline makes it an ideal starting point for exploring the city.`
      },
      {
        title: 'Unique Characteristics',
        text: `Known for its bustling markets, historic architecture, and diverse cultural elements, the Strip District offers a unique urban experience. The neighborhood features thriving restaurants, specialty shops, and nightlife spots. It's currently transitioning from its industrial roots to a more modern, high-tech neighborhood while maintaining its authentic character. The area is easily accessible via public transit, making it a convenient stop on your scavenger hunt journey.`
      },
      {
        title: 'BMW Connection',
        text: `The Strip District's industrial heritage connects perfectly to BMW's engineering excellence. Just as this neighborhood has transformed from industrial center to modern urban destination while preserving its character, BMW has evolved from its manufacturing origins to become a leader in automotive innovation while honoring its heritage. Both the Strip District and BMW represent a perfect blend of tradition and innovation, respecting the past while embracing the future.`
      }
    ],
    next: {
      slug: 'bloomfield',
      label: 'Continue to Bloomfield',
      text: `Continue your journey through Pittsburgh's vibrant neighborhoods by heading to Bloomfield, Pittsburgh's "Little Italy," where European heritage and culinary traditions await.`
    }
  },
  bloomfield: {
    title: 'Bloomfield',
    hero: '/assets/images/neighborhoods/bloomfield_hero.jpg',
    tagline: `Pittsburgh's Little Italy`,
    welcome: 'Welcome to Bloomfield',
    intro: `Discover Bloomfield, Pittsburgh's "Little Italy," a vibrant neighborhood with rich European heritage and a welcoming community atmosphere. Centrally located in Pittsburgh, adjacent to Lawrenceville, Shadyside, Garfield, and East Liberty, Bloomfield serves as a cultural crossroads in the city.`,
    featureImg: '/assets/images/neighborhoods/bloomfield_feature.jpg',
    about: `While known today as Pittsburgh's "Little Italy," Bloomfield was originally settled by German and English immigrants before becoming a significant Italian-American community, particularly from the Abruzzi region of Italy. The neighborhood actually pre-dates the American Revolution, formerly known as the Taub-Winebiddle Plantation in the 1700s. This rich history has shaped Bloomfield into a neighborhood with deep cultural roots and a strong sense of community identity.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Bloomfield is home to several historic landmarks, including the Log Cabin, East Side Pedestrian Bridge, and Schenley Farms. From the neighborhood, you can also see the Cathedral of Learning, an iconic Pittsburgh landmark. Until recently, the Immaculate Conception Church was a neighborhood centerpiece, though it closed in 2022. These landmarks reflect the neighborhood's rich cultural and architectural heritage.`
      },
      {
        title: 'Unique Characteristics',
        text: `Bloomfield's vibrant Italian-American community has created a diverse culinary scene featuring classic pizzerias, old-school Italian restaurants, and trendy cafes. The neighborhood provides a sense of familiarity for immigrant communities while welcoming newcomers. Its central location makes it an accessible hub for exploring Pittsburgh, while its rich cultural heritage gives it a distinct character among the city's neighborhoods.`
      },
      {
        title: 'BMW Connection',
        text: `Bloomfield's Italian heritage connects to European design sensibilities that BMW, as a European luxury brand, embodies in its vehicles. The neighborhood's culinary excellence parallels BMW's precision engineering—both representing a commitment to quality and craftsmanship. Just as Bloomfield celebrates cultural diversity while maintaining its unique identity, BMW creates vehicles that appeal globally while remaining distinctively BMW in character and performance.`
      }
    ],
    next: {
      slug: 'shadyside',
      label: 'Continue to Shadyside',
      text: `Continue your journey through Pittsburgh's vibrant neighborhoods by heading to Shadyside, where historic elegance meets modern luxury.`
    }
  },
  shadyside: {
    title: 'Shadyside',
    hero: '/assets/images/neighborhoods/shadyside_hero.jpg',
    tagline: 'Historic Elegance Meets Modern Luxury',
    welcome: 'Welcome to Shadyside',
    intro: `Discover Shadyside, an upscale neighborhood in Pittsburgh's East End that perfectly balances historic charm with contemporary sophistication. Known for its tree-lined streets, distinctive architecture, and vibrant shopping districts, Shadyside offers a refined urban experience.`,
    featureImg: '/assets/images/neighborhoods/shadyside_feature.jpg',
    about: `Originally farmland, Shadyside transformed into a residential neighborhood in the late 1800s as Pittsburgh's industrial wealth sought elegant homes away from the city center. The neighborhood is considered a "veritable museum" of domestic architecture from the 1860s to 1920s, showcasing a variety of architectural styles that reflect the city's prosperous past. This rich architectural heritage has been carefully preserved, making Shadyside one of Pittsburgh's most visually distinctive neighborhoods.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Shadyside is home to several architectural and cultural landmarks, including the Calvary Episcopal Church at 315 Shady Avenue, the historic Hunt Armory (a designated historic site), and the Shadyside Presbyterian Church, which is listed on the National Register of Historic Places. The neighborhood's Victorian homes and historical chapels provide a glimpse into Pittsburgh's architectural past while serving as anchors for the community.`
      },
      {
        title: 'Unique Characteristics',
        text: `One of Shadyside's most distinctive features is its three separate business districts, each with its own character and offerings. The neighborhood is home to numerous boutiques, creating a sophisticated shopping experience. Its rich architectural heritage creates a unique visual landscape, while the blend of historical and modern urban elements makes it a neighborhood that honors its past while embracing contemporary urban living.`
      },
      {
        title: 'BMW Connection',
        text: `Shadyside's upscale neighborhood aesthetic aligns perfectly with BMW's luxury positioning in the automotive market. The architectural elegance found throughout the neighborhood mirrors BMW's design precision and attention to detail. Just as Shadyside balances historical preservation with modern touches, BMW honors its heritage while continuously innovating—both representing a commitment to timeless quality and forward-thinking design.`
      }
    ],
    next: {
      slug: 'regent_square',
      label: 'Continue to Regent Square',
      text: `Complete your journey through Pittsburgh's vibrant neighborhoods by heading to Regent Square, where nature and community create a charming urban oasis.`
    }
  },
  regent_square: {
    title: 'Regent Square',
    hero: '/assets/images/neighborhoods/regent_square_hero.jpg',
    tagline: 'Where Nature Meets Community',
    welcome: 'Welcome to Regent Square',
    intro: `Discover Regent Square, a charming neighborhood in Pittsburgh's East End that offers a perfect blend of natural beauty and urban convenience. Located adjacent to the expansive Frick Park and characterized by tree-lined streets, Regent Square provides a tranquil retreat within the city.`,
    featureImg: '/assets/images/neighborhoods/regent_square_feature.jpg',
    about: `The origins of Regent Square trace back to the late 18th and 19th centuries, with early landowners including Colonel Dunning McNair and Judge William Watkins. Classified as a historic streetcar suburb, the neighborhood developed as transportation expanded outward from Pittsburgh's center. Today, Regent Square is known for its historic character, community atmosphere, and proximity to one of Pittsburgh's largest parks, making it a desirable residential area that combines urban amenities with natural surroundings.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Until its closure in 2019, the Regent Square Theatre on Braddock Avenue was a cultural landmark, operating from 1936 as a beloved community cinema. The neighborhood's proximity to Frick Park provides residents and visitors with access to one of Pittsburgh's largest green spaces. Historic apartment buildings scattered throughout the neighborhood showcase architectural styles from the early 20th century, adding to Regent Square's distinctive character.`
      },
      {
        title: 'Unique Characteristics',
        text: `Regent Square is situated between Fern Hollow Creek valley and Nine Mile Run, with Forbes Avenue marking its northern border. The neighborhood is characterized by its tree-lined streets and is often described as a cozy, family-friendly area. Despite its name, there is no actual "square" in Regent Square—a quirky fact that adds to its charm. This compact and welcoming urban neighborhood offers a unique blend of natural beauty and community spirit.`
      },
      {
        title: 'BMW Connection',
        text: `Regent Square's tree-lined streets evoke the scenic driving routes often featured in BMW marketing, where the joy of driving is enhanced by beautiful surroundings. The neighborhood's historic character connects to BMW's appreciation for heritage, while its proximity to nature (Frick Park) aligns with BMW's growing commitment to sustainability and environmental consciousness. Both Regent Square and BMW represent a harmonious balance between tradition and forward-thinking values.`
      }
    ],
    next: {
      slug: 'lawrenceville',
      label: 'Return to Start',
      text: `You've completed the BMW Charity Scavenger Hunt across Pittsburgh's vibrant neighborhoods. Return to any location to see your progress or start again from the beginning.`
    }
  }
};

// PassportStampAnimation and progressive registration logic as in LocationPage
const PassportStampAnimation = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(255,255,255,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.5s'
    }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="#fff" stroke="#1c69d4" strokeWidth="8" />
          <text x="50%" y="54%" textAnchor="middle" fill="#1c69d4" fontSize="32" fontWeight="bold" fontFamily="Arial" dy=".3em">BMW</text>
        </svg>
        <div style={{ marginTop: 24, fontSize: 28, color: '#1c69d4', fontWeight: 'bold', fontFamily: 'Arial' }}>
          <span style={{ animation: 'stamp 0.7s cubic-bezier(.36,2,.6,1) forwards' }}>STAMPED!</span>
        </div>
        <style>{`
          @keyframes stamp {
            0% { opacity: 0; transform: scale(2) rotate(-10deg); }
            60% { opacity: 1; transform: scale(1.1) rotate(2deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

const NeighborhoodPage = () => {
  const { slug } = useParams();
  const [showAnimation, setShowAnimation] = useState(true);
  const [showFirstNamePrompt, setShowFirstNamePrompt] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [firstName, setFirstName] = useState(Cookies.get('first_name') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    // Set the stamp cookie for this location
    Cookies.set(`stamp_location_${slug}`, 'true', { expires: 365 });
  }, [slug]);

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
      Cookies.set('first_name', firstNameInput.trim(), { expires: 365 });
      setFirstName(firstNameInput.trim());
      setShowFirstNamePrompt(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      Cookies.set('email', emailInput.trim(), { expires: 365 });
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
          Cookies.set('user_id', data.user_id, { expires: 365 });
        }
      } catch {}
    }
  };

  const n = NEIGHBORHOODS[slug];
  if (!n) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Neighborhood not found.</div>;
  }

  // Calculate progress
  const totalNeighborhoods = Object.keys(NEIGHBORHOODS).length;
  const visited = Object.keys(Cookies.get()).filter(k => k.startsWith('stamp_location_')).length;
  const progressPercent = Math.min(visited / totalNeighborhoods, 1) * 100;

  // Event name and tagline
  const EVENT_NAME = 'How to Pittsburgh';
  const EVENT_TAGLINE = 'How better to experience Pittsburgh than in a BMW? Complete the passport and get a chance to do just that.';

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* My Passport Button */}
      <Link to="/my-passport" style={{ position: 'fixed', top: 24, right: 24, zIndex: 3000, background: '#1c69d4', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', fontSize: 16, textDecoration: 'none', boxShadow: '0 2px 8px #eee' }}>My Passport</Link>
      {showAnimation && <PassportStampAnimation onDone={() => setShowAnimation(false)} />}
      <div style={{ display: showAnimation ? 'none' : 'block' }}>
        {/* Event Title and Tagline */}
        <div style={{ textAlign: 'center', padding: '32px 0 0 0' }}>
          <h1 style={{ fontSize: 44, color: '#1c69d4', margin: 0, fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Arial, Helvetica, sans-serif' }}>{EVENT_NAME}</h1>
          <div style={{ fontSize: 20, color: '#222', margin: '12px 0 24px 0', fontWeight: 500 }}>{EVENT_TAGLINE}</div>
          {firstName && <div style={{ fontSize: 22, color: '#1c69d4', marginTop: 12 }}>Welcome back, {firstName}!</div>}
        </div>
        {/* Hero Section */}
        <section style={{ backgroundImage: `url(${n.hero})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '48px 0', color: '#fff', textAlign: 'center' }}>
          <img src={bmwLogo} alt="BMW Logo" style={{ width: 80, marginBottom: 16, background: 'rgba(255,255,255,0.7)', borderRadius: 40 }} />
          <h1 style={{ fontSize: 40, margin: 0 }}>{n.title}</h1>
          <p style={{ fontSize: 22, margin: 0 }}>{n.tagline}</p>
        </section>
        {/* Progress Bar */}
        <div style={{ maxWidth: 400, margin: '24px auto 0', padding: '0 16px' }}>
          <div style={{ color: '#222', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Progress: {visited} / {totalNeighborhoods} Neighborhoods</div>
          <div style={{ background: '#e0e6ed', borderRadius: 8, height: 18, width: '100%', overflow: 'hidden', boxShadow: '0 1px 4px #eee' }}>
            <div style={{ width: `${progressPercent}%`, background: '#1c69d4', height: '100%', transition: 'width 0.5s', borderRadius: 8 }} />
          </div>
        </div>
        {/* Info Section */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
          <h2 style={{ color: '#111' }}>{n.welcome}</h2>
          <p style={{ color: '#222' }}>{n.intro}</p>
          <div style={{ margin: '32px 0' }}>
            <img src={n.featureImg} alt={`${n.title} Feature`} style={{ width: '100%', borderRadius: 12, boxShadow: '0 2px 8px #eee' }} />
          </div>
          <h3 style={{ color: '#111' }}>About {n.title}</h3>
          <p style={{ color: '#222' }}>{n.about}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, margin: '32px 0' }}>
            {n.features.map((f, i) => (
              <div key={i} style={{ flex: '1 1 250px', background: '#f4f8fb', borderRadius: 8, padding: 20, boxShadow: '0 1px 4px #eee' }}>
                <h3 style={{ color: '#1c69d4' }}>{f.title}</h3>
                <p style={{ color: '#222' }}>{f.text}</p>
              </div>
            ))}
          </div>
          {/* Next Location Hint */}
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <h3 style={{ color: '#111' }}>Your Next Destination</h3>
            <p style={{ color: '#222' }}>{n.next.text}</p>
            <Link to={`/location/${n.next.slug}`} style={{ display: 'inline-block', background: '#1c69d4', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 'bold', fontSize: 18, textDecoration: 'none', marginTop: 16 }}>{n.next.label}</Link>
          </div>
        </section>
        {/* BMW Branding Section */}
        <section style={{ background: '#f4f8fb', padding: '32px 0' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <img src="/assets/images/bmw/bmw_emblem.svg" alt="BMW Emblem" style={{ width: 80, marginBottom: 16 }} />
            <div style={{ fontSize: 22, color: '#1c69d4', fontWeight: 'bold', marginBottom: 8 }}>Sheer Driving Pleasure</div>
            <div style={{ fontSize: 16, color: '#222' }}>
              <p>BMW is proud to sponsor this charity scavenger hunt across Pittsburgh's most vibrant neighborhoods. As a brand committed to luxury, innovation, and community engagement, we invite you to experience the unique character of each neighborhood while supporting a great cause.</p>
            </div>
          </div>
        </section>
      </div>
      {/* First Name Prompt */}
      {showFirstNamePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.97)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleFirstNameSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 16px #bbb', border: '2px solid #1c69d4', textAlign: 'center', color: '#111' }}>
            <h2 style={{ color: '#1c69d4' }}>So, you have visited us a couple of times, we should really be on a first name basis. What's yours?</h2>
            <label style={{ fontSize: 18, color: '#111' }}>What's your first name?</label>
            <input value={firstNameInput} onChange={e => setFirstNameInput(e.target.value)} required style={{ width: '100%', margin: '16px 0', padding: 8, fontSize: 16, color: '#111', background: '#fff', border: '2px solid #1c69d4', borderRadius: 6, boxShadow: '0 1px 4px #bbb', outline: 'none' }} />
            <button type="submit" style={{ background: '#1c69d4', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16 }}>Continue</button>
          </form>
        </div>
      )}
      {/* Email Prompt */}
      {showEmailPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.97)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleEmailSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 16px #bbb', border: '2px solid #1c69d4', textAlign: 'center', color: '#111' }}>
            <h2 style={{ color: '#1c69d4' }}>Let's stay in touch!</h2>
            <label style={{ fontSize: 18, color: '#111' }}>What's your email address?</label>
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required style={{ width: '100%', margin: '16px 0', padding: 8, fontSize: 16, color: '#111', background: '#fff', border: '2px solid #1c69d4', borderRadius: 6, boxShadow: '0 1px 4px #bbb', outline: 'none' }} />
            <button type="submit" style={{ background: '#1c69d4', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16 }}>Continue</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodPage; 