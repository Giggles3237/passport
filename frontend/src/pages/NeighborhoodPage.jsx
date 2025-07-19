// NeighborhoodPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../assets/logo.svg';
import { setCookieIfConsented } from '../cookieUtils';
import visitTracker from '../visitTracker';
import RegisterModal from './RegisterPage';
import MyPassportModal from './MyPassportPage';

/* ------------------------------------------------------------------
   NEIGHBORHOOD DATA  –  update image paths to match your build setup
   ------------------------------------------------------------------ */
const NEIGHBORHOODS = {
  lawrenceville: {
    title: 'Lawrenceville',
    hero: '/assets/images/neighborhoods/lawrenceville_hero.jpg',
    logo: '/assets/images/location_logos/lawrenceville_icon.jpg',
    lottie: '/assets/lotties/Lawrenceville Stamp.json',
    tagline: 'Where History Meets Innovation',
    welcome: 'Welcome to Lawrenceville',
    intro: `Discover one of Pittsburgh's oldest and most vibrant neighborhoods, where historic charm meets contemporary creativity. Located less than three miles from Downtown Pittsburgh, Lawrenceville has transformed from its industrial roots into a thriving cultural hub.`,
    featureImg: '/assets/images/neighborhoods/lawrenceville_feature.jpg',
    about: `Founded in 1814 and named after Captain James Lawrence from the War of 1812, Lawrenceville boasts a rich history that spans over two centuries. In 2019, it was designated as a Historic District and added to the National Register of Historic Places, recognizing its architectural significance and cultural heritage. The neighborhood's transformation from industrial center to creative district exemplifies Pittsburgh's own evolution.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Lawrenceville is home to the Allegheny Arsenal, the Doughboy Statue, the Carnegie Library’s Lawrenceville Branch and the Stephen Foster House.`
      },
      {
        title: 'Unique Characteristics',
        text: `With Butler Street and Penn Avenue serving as its main arteries, Lawrenceville has become a haven for artists and creatives, with galleries, coffee shops and a rich mix of restaurants, bars and independent retail.`
      }
    ],
    /* --- NEW --- */
    restaurants: [
      {
        name: 'Driftwood Oven',
        image: '/assets/images/restaurants/driftwood_oven.jpg',
        description:
          'James Beard–nominated pizzeria and bakery famous for naturally-leavened sourdough pies, hearty sandwiches and artisan breads.',
        website: 'https://driftwoodoven.com',
        menu: 'https://driftwoodoven.com/menu',
        reviews: 'https://www.yelp.com/biz/driftwood-oven-pittsburgh'
      },
      {
        name: 'The Vandal',
        image: '/assets/images/restaurants/the_vandal.jpg',
        description:
          'Intimate neighborhood restaurant & 5-seat wine bar with an ever-changing, hyper-seasonal menu (and a killer weekend brunch).',
        website: 'https://thevandalpgh.com',
        menu: 'https://thevandalpgh.com/menus',
        reviews: 'https://www.opentable.com/r/the-vandal-pittsburgh'
      },
      {
        name: 'Parlor Dim Sum',
        image: '/assets/images/restaurants/parlor_dimsum.jpg',
        description:
          'Chef Roger Li’s modern Cantonese spot for late-night dim sum, cocktails and Cantonese BBQ – think “little Hong Kong” on Butler St.',
        website: 'https://theparlordimsum.com',
        menu: 'https://theparlordimsum.com/menu',
        reviews: 'https://www.yelp.com/biz/the-parlor-dim-sum-and-cantonese-bbq-pittsburgh'
      },
      {
        name: "Burgh'ers Brewing",
        image: '/assets/images/restaurants/burghers.jpg',
        description:
          'Chef-driven smash-burger joint & craft brewery focused on local, ethical and sustainable beef & beer.',
        website: 'https://burgherspgh.com/lawrenceville',
        menu: 'https://burgherspgh.com/lawrenceville#menu',
        reviews: 'https://www.yelp.com/biz/burghers-brewing-pittsburgh-4'
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
    logo: '/assets/images/location_logos/stripdistrict_icon.jpg',
    lottie: '/assets/lotties/Strip District Stamp.json',
    tagline: 'Where Industry Meets Culinary Excellence',
    welcome: 'Welcome to the Strip District',
    intro: `Nestled along the Allegheny River, the Strip District blends Pittsburgh’s past with its foodie present. Warehouses now house bustling markets, tech offices, cafés and destination restaurants.`,
    featureImg: '/assets/images/neighborhoods/strip_district_feature.jpg',
    about: `Once a produce-wholesale corridor, the Strip is now a lively mix of ethnic grocers, street vendors and cutting-edge eateries – all beneath 19th-century brick facades.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Find the Heinz History Center, Pennsylvania Macaroni Co. and the original Primanti Bros. – plus weekend street markets loaded with Steelers merch and fresh biscotti.`
      }
    ],
    restaurants: [
      {
        name: 'Balvanera',
        image: '/assets/images/restaurants/balvanera.jpg',
        description:
          'Chef Fernando Navas’ Buenos Aires–style brasserie serving grass-fed Argentinian steaks, house-made sausages and South American wines in a stylish converted warehouse.',
        website: 'https://www.balvanerarestaurants.com/location/balvanera-pittsburgh/',
        menu: 'https://www.balvanerarestaurants.com/location/balvanera-pittsburgh/#menu',
        reviews: 'https://www.yelp.com/biz/balvanera-pittsburgh'
      },
      {
        name: 'De Fer Coffee & Tea',
        image: '/assets/images/restaurants/defer_coffee.jpg',
        description:
          'Flagship roastery-café pouring single-origin coffee, tea, natural wine and craft cocktails – plus weekend live music – inside a lofty Smallman St. space.',
        website: 'https://www.defer.coffee/strip-district',
        menu: 'https://www.defer.coffee/strip-district#sample-menu',
        reviews: 'https://www.yelp.com/biz/de-fer-coffee-pittsburgh-4'
      }
    ],
    next: {
      slug: 'downtown',
      label: 'Continue to Downtown',
      text: `Continue your journey through Pittsburgh's vibrant neighborhoods by heading to Downtown Pittsburgh, the city's central district brimming with cultural landmarks.`
    }
  },

  downtown: {
    title: 'Downtown',
    hero: '/assets/images/neighborhoods/downtown_hero.jpg',
    logo: '/assets/images/location_logos/downtown_icon.jpg',
    lottie: '/assets/lotties/Downtown Stamp.json',
    tagline: 'The Heart of Pittsburgh',
    welcome: 'Welcome to Downtown',
    intro: `Explore the Golden Triangle where skyscrapers meet three rivers, theater marquis glow and new restaurants pop up next to century-old landmarks.`,
    featureImg: '/assets/images/neighborhoods/downtown_feature.jpg',
    about: `Point State Park, Market Square and the gleaming towers of PPG Place anchor Pittsburgh’s commercial core. Recent years have added riverfront trails, boutique hotels and a booming brunch scene.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Visit the Fort Pitt Blockhouse (built 1764), grab a selfie at the Water Steps on North Shore Drive, or catch a show in the Cultural District.`
      }
    ],
    restaurants: [
      {
        name: 'The Speckled Egg',
        image: '/assets/images/restaurants/speckled_egg.jpg',
        description:
          'Day-time diner inside the stunning Union Trust Building; famous for creative brunch plates (fried-chicken biscuit!), cocktails and locally roasted espresso.',
        website: 'https://downtown.thespeckledeggpgh.com',
        menu: 'https://downtown.thespeckledeggpgh.com/#food-menu',
        reviews: 'https://www.yelp.com/biz/the-speckled-egg-pgh-pittsburgh'
      },
      {
        name: 'Café Momentum',
        image: '/assets/images/restaurants/cafe_momentum.jpg',
        description:
          'Non-profit, BYOB fine-dining spot that trains justice-involved youth in every kitchen role; expect farm-to-table plates that “change lives with every bite.”',
        website: 'https://cafemomentum.org/restaurant/pittsburgh/',
        menu: 'https://cafemomentum.org/menu',
        reviews: 'https://www.yelp.com/biz/caf%C3%A9-momentum-pittsburgh-pittsburgh'
      },
      {
        name: "Vallozzi's Pittsburgh",
        image: '/assets/images/restaurants/vallozzis.jpg',
        description:
          'Family-run Italian institution (1950 →) known for house-made mozzarella, handmade pasta and a Wine-Spectator-awarded cellar.',
        website: 'https://vallozzis.com',
        menu: 'https://vallozzis.com/#menus',
        reviews: 'https://www.opentable.com/vallozzis-pittsburgh'
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
    logo: '/assets/images/location_logos/bloomfield_icon.jpg',
    lottie: '/assets/lotties/Bloomfield Stamp.json',
    tagline: `Pittsburgh's Little Italy`,
    welcome: 'Welcome to Bloomfield',
    intro: `Discover Bloomfield, a neighborhood where old-school Italian red-sauce joints share the block with buzzy new cocktail bars and international kitchens.`,
    featureImg: '/assets/images/neighborhoods/bloomfield_feature.jpg',
    about: `Settled by German and English immigrants before waves of Italians arrived from Abruzzo, Bloomfield’s Liberty Ave. still hosts the annual Little Italy Days festival.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Look for the vintage neon at the Bloomfield Bridge Tavern sign, and the view of the Cathedral of Learning rising beyond rowhouses.`
      }
    ],
    restaurants: [
      {
        name: "Khalil's",
        image: '/assets/images/restaurants/khalils.avif',
        description:
          'Family-run Syrian restaurant (since 1972) serving mezze platters, kebabs and legendary house-baked pita in an ornately tiled dining room.',
        website: 'https://khalilsrestaurant.com',
        menu: 'https://khalilsrestaurant.com/#menu',
        reviews: 'https://www.yelp.com/biz/khalils-ii-pittsburgh'
      },
      {
        name: 'COBRA',
        image: '/assets/images/restaurants/cobra.jpg',
        description:
          'Late-night yakiniku BBQ & craft-cocktail lounge with private karaoke suites – part supper-club, part dance-floor, 100 % vibe.',
        website: 'https://cobrapgh.com',
        menu: 'https://cobrapgh.com/#menu',
        reviews: 'https://www.yelp.com/biz/cobra-pittsburgh'
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
    logo: '/assets/images/location_logos/shadyside_icon.jpg',
    lottie: '/assets/lotties/Shadyside Stamp.json',
    tagline: 'Historic Elegance Meets Modern Luxury',
    welcome: 'Welcome to Shadyside',
    intro: `Tree-lined streets, Victorian mansions and three boutique shopping districts make Shadyside an East-End favorite.`,
    featureImg: '/assets/images/neighborhoods/shadyside_feature.jpg',
    about: `Once farmland, Shadyside grew into a fashionable trolley suburb in the late 1800s; its residential architecture spans everything from Queen Anne to Arts-and-Crafts.`,
    features: [
      {
        title: 'Notable Landmarks',
        text: `Look for the Calvary Episcopal Church’s 15th-century stained glass and the imposing Hunt Armory (a WWII tank-depot turned event hall).`
      }
    ],
    restaurants: [
      {
        name: 'Lilith',
        image: '/assets/images/restaurants/lilith.jpg',
        description:
          'Sicilian-and-Puerto-Rican-inspired tasting plates, natural wine and playful desserts in an intimate, art-filled space run by chefs Jamilka Borges & Dianne DeStefano.',
        website: 'https://lilithpgh.com',
        menu: 'https://lilithpgh.com/#menu',
        reviews: 'https://www.yelp.com/biz/lilith-pittsburgh'
      },
      {
        name: 'Palm Palm',
        image: '/assets/images/restaurants/palm_palm.jpg',
        description:
          'Palm-Springs-meets-Pittsburgh: coastal-California plates, vintage glam décor, a breezy patio and green-juice margaritas.',
        website: 'https://palmpalmpgh.com',
        menu: 'https://palmpalmpgh.com/#menu',
        reviews: 'https://www.yelp.com/biz/palm-palm-pittsburgh'
      },
      {
        name: 'Senyai Thai Kitchen',
        image: '/assets/images/restaurants/senyai.jpg',
        description:
          'Chef Tu Wade’s authentic Thai kitchen using organic chicken, house-made curries and a leafy back-patio that feels like Bangkok in PA.',
        website: 'https://senyaipgh.com',
        menu: 'https://senyaipgh.com/#menu',
        reviews: 'https://www.yelp.com/biz/senyai-thai-kitchen-pittsburgh'
      },
      {
        name: "Mercurio's Gelato & Pizza",
        image: '/assets/images/restaurants/mercurios.jpg',
        description:
          'Wood-fired Neapolitan pies and house-made gelato (don’t skip the pistachio) – a Walnut Street staple.',
        website: 'https://mercuriosgelatopizza.com',
        menu: 'https://mercuriosshadyside.com',
        reviews: 'https://www.yelp.com/biz/mercurios-shadyside-pittsburgh'
      }
    ],
  },

};
const PassportStampAnimation = ({ onDone, src }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000); // increased from 2s to 4s
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(255,255,255,0.95)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.5s'
    }}>
      <lottie-player
        autoplay
        src={src || '/assets/images/visa_lottie'}
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------
   MAIN COMPONENT  –  food section added
   ------------------------------------------------------------------ */
const NeighborhoodPage = () => {
  const { slug } = useParams();
  const [showAnimation, setShowAnimation] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [hasShownAutoModal, setHasShownAutoModal] = useState(false);

  // Removed name and email prompts - keeping only auto register modal

  // Auto-show register modal on first visit after 4 seconds (only if not already registered)
  useEffect(() => {
    const user_id = Cookies.get('user_id');
    const hasRegistered = user_id && user_id.length > 0;
    
    if (!showAnimation && !hasShownAutoModal && !hasRegistered) {
      const timer = setTimeout(() => {
        setShowRegisterModal(true);
        setHasShownAutoModal(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showAnimation, hasShownAutoModal]);

  useEffect(() => {
    if (slug) {
      setCookieIfConsented(`stamp_location_${slug}`, 'true', { expires: 365 });
      
      // Track the visit
      visitTracker.trackVisit(slug);
      
      // Increment visit count for prompt logic
      const currentVisitCount = parseInt(Cookies.get('visit_count') || '0');
      const newVisitCount = currentVisitCount + 1;
      setCookieIfConsented('visit_count', newVisitCount.toString(), { expires: 365 });
    }
  }, [slug]);

  // Removed unused handler functions for name and email prompts

  /* stamp + prompt logic unchanged ... */

  const n = NEIGHBORHOODS[slug];
  if (!n) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Neighborhood not found.</div>;
  }

  /* progress calc unchanged ... */

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* My Passport Button at the bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '48px 0 0 0' }}>
        <button
          onClick={() => setShowPassportModal(true)}
          style={{
            background: '#fff',
            color: '#1c69d4',
            border: '2px solid #1c69d4',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: 18,
            padding: '14px 36px',
            boxShadow: '0 2px 8px #eee',
            cursor: 'pointer',
            marginTop: 0,
            marginBottom: 0,
            outline: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          aria-label="View My Passport"
        >
          My Passport
        </button>
      </div>
      {showPassportModal && <MyPassportModal onClose={() => setShowPassportModal(false)} />}

      {showAnimation && (
        <PassportStampAnimation
          onDone={() => setShowAnimation(false)}
          src={n.lottie}
        />
      )}

      {/* hide content behind animation */}
      <div style={{ display: showAnimation ? 'none' : 'block' }}>
        {/* Hero Section */}
        <section
          style={{
            backgroundImage: `url(${n.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '120px 16px',
            position: 'relative',
          }}
        >
          {/* Dark overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '3rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
              letterSpacing: '1px'
            }}>{n.title}</h1>
            <p style={{ 
              fontSize: 20, 
              marginTop: '16px',
              textShadow: '1px 1px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
              fontWeight: '500'
            }}>{n.tagline}</p>
          </div>
        </section>

        {/* Info Section */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
          <h2 style={{ color: '#1c69d4' }}>{n.welcome}</h2>
          <p style={{ fontSize: 18, marginBottom: 24 }}>{n.intro}</p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
            <button
              onClick={() => setShowRegisterModal(true)}
              style={{
                background: '#1c69d4',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 24,
                padding: '24px 48px',
                border: 'none',
                borderRadius: 16,
                boxShadow: '0 4px 24px #1c69d455',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                textShadow: '0 2px 8px #0002',
                letterSpacing: 1,
                outline: 'none',
                margin: 0,
              }}
              aria-label="Enter BMW's How To Pittsburgh contest"
            >
              Enter BMW's "How To Pittsburgh" Contest
            </button>
          </div>
          {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
          {n.featureImg && (
            <img
              src={n.featureImg}
              alt={`${n.title} feature`}
              style={{ width: '100%', borderRadius: 8, marginBottom: 24 }}
            />
          )}
          <h3 style={{ color: '#1c69d4', marginTop: 0 }}>About {n.title}</h3>
          <p style={{ marginBottom: 32 }}>{n.about}</p>
          {n.features && n.features.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                marginBottom: 32,
              }}
            >
              {n.features.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 250px',
                    background: '#f4f8fb',
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <h4 style={{ color: '#1c69d4', margin: '0 0 8px' }}>{f.title}</h4>
                  <p style={{ margin: 0 }}>{f.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* -------------- NEW FOOD SECTION -------------- */}
          {n.restaurants && n.restaurants.length > 0 && (
            <section style={{ margin: '48px 0' }}>
              <h3 style={{ color: '#111', marginBottom: 16 }}>Food &amp; Drink Highlights</h3>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 24,
                justifyContent: 'center'
              }}>
                {n.restaurants.map((r, idx) => (
                  <div key={idx} style={{
                    flex: '1 1 250px', maxWidth: 320,
                    background: '#fff', borderRadius: 8,
                    boxShadow: '0 2px 8px #ddd', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column'
                  }}>
                    {r.image && (
                      <img src={r.image} alt={r.name}
                        style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: 20, flexGrow: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#1c69d4' }}>{r.name}</h4>
                      <p style={{ color: '#222', fontSize: 15, marginBottom: 12 }}>{r.description}</p>
                    </div>
                    <div style={{
                      display: 'flex', gap: 8,
                      padding: '0 20px 20px 20px', flexWrap: 'wrap'
                    }}>
                      {r.website && (
                        <a href={r.website} target="_blank" rel="noopener noreferrer"
                          style={linkBtn}>Website</a>
                      )}
                      {r.menu && (
                        <a href={r.menu} target="_blank" rel="noopener noreferrer"
                          style={linkBtn}>Menu</a>
                      )}
                      {r.reviews && (
                        <a href={r.reviews} target="_blank" rel="noopener noreferrer"
                          style={linkBtn}>Reviews</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </section>
        {/* BMW Branding */}
        <section
          style={{
            background: '#f4f8fb',
            textAlign: 'center',
            padding: '48px 16px',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 140, marginBottom: 16 }}
          />
          <div style={{ fontSize: 18, color: '#1c69d4', marginBottom: 8 }}>
            Sheer Driving Pleasure
          </div>
          <p style={{ maxWidth: 600, margin: '0 auto', color: '#000' }}>
            BMW is proud to sponsor this digital passport experience across
            Pittsburgh's most vibrant neighborhoods. Explore each stop, collect
            your stamps and enjoy the journey.
          </p>
          <p style={{ marginTop: 16 }}>
            <Link to="/official-rules" style={{ color: '#1c69d4' }}>
              Official Rules
            </Link>
          </p>
        </section>
      </div>

    </div>
  );
};

/* small helper for the link buttons */
const linkBtn = {
  flex: '1 0 auto',
  background: '#1c69d4',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'center',
  textDecoration: 'none'
};

export default NeighborhoodPage;