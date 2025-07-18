import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class VisitTracker {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Get or create a session ID for anonymous tracking
   */
  getOrCreateSessionId() {
    let sessionId = Cookies.get('session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      Cookies.set('session_id', sessionId, { expires: 365 });
    }
    return sessionId;
  }

  /**
   * Generate a random session ID
   */
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Track a visit to a location
   * @param {string} slug - The neighborhood slug
   */
  async trackVisit(slug) {
    try {
      // Get location ID from slug
      const locationResponse = await fetch(`${API_URL}/location/slug/${slug}`);
      if (!locationResponse.ok) {
        console.warn(`Could not get location ID for slug: ${slug}`);
        return;
      }
      
      const locationData = await locationResponse.json();
      const locationId = locationData.id;
      
      // Get user ID if available
      const userId = Cookies.get('user_id') || null;
      
      // Track the visit
      const visitResponse = await fetch(`${API_URL}/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_id: locationId,
          session_id: this.sessionId,
          user_id: userId
        }),
        credentials: 'include'
      });

      if (visitResponse.ok) {
        const visitData = await visitResponse.json();
        console.log(`Visit tracked for ${slug}:`, visitData);
      } else {
        console.warn(`Failed to track visit for ${slug}:`, await visitResponse.text());
      }
    } catch (error) {
      console.error(`Error tracking visit for ${slug}:`, error);
    }
  }

  /**
   * Get visit statistics for a location
   * @param {string} slug - The neighborhood slug
   */
  async getVisitStats(slug) {
    try {
      const locationResponse = await fetch(`${API_URL}/location/slug/${slug}`);
      if (!locationResponse.ok) {
        return null;
      }
      
      const locationData = await locationResponse.json();
      const locationId = locationData.id;
      
      const statsResponse = await fetch(`${API_URL}/visit/stats/${locationId}`);
      if (statsResponse.ok) {
        return await statsResponse.json();
      }
    } catch (error) {
      console.error(`Error getting visit stats for ${slug}:`, error);
    }
    return null;
  }

  /**
   * Get all visits for the current user
   */
  async getUserVisits() {
    const userId = Cookies.get('user_id');
    if (!userId) {
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/visit/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.visits || [];
      }
    } catch (error) {
      console.error('Error getting user visits:', error);
    }
    return [];
  }
}

// Create a singleton instance
const visitTracker = new VisitTracker();

export default visitTracker; 