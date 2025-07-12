/**
 * BMW Charity Scavenger Hunt - Tracking JavaScript
 * Created: June 13, 2025
 * Description: JavaScript for cookie tracking and user data collection
 */

// Main tracking object
const BMWScavengerHunt = {
  // Configuration
  config: {
    cookieName: 'bmw_scavenger_hunt',
    cookieExpiration: 30, // days
    neighborhoods: [
      'lawrenceville',
      'strip_district',
      'downtown',
      'bloomfield',
      'shadyside',
    ],
    formThreshold: {
      name: 3, // Show name form after visiting 3 locations
      email: 5  // Show email form after visiting all 5 locations
    }
  },
  
  // User data storage
  userData: {
    visitedLocations: [],
    name: '',
    email: ''
  },
  
  /**
   * Initialize the tracking system
   */
  init: function() {
    console.log('Initializing BMW Scavenger Hunt tracking...');
    
    // Check for cookie support
    if (!this.cookiesEnabled()) {
      this.showCookieWarning();
      return;
    }
    
    // Load existing data from cookies
    this.loadUserData();
    
    // Track current page visit
    this.trackCurrentPageVisit();
    
    // Check if we should show forms based on visit count
    this.checkFormsToShow();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('Tracking initialized successfully');
  },
  
  /**
   * Check if cookies are enabled in the browser
   * @returns {boolean} True if cookies are enabled
   */
  cookiesEnabled: function() {
    try {
      // Try to set a test cookie
      document.cookie = "testcookie=1; max-age=10";
      const hasCookie = document.cookie.indexOf("testcookie") !== -1;
      
      // Clean up the test cookie
      document.cookie = "testcookie=1; max-age=0";
      
      return hasCookie;
    } catch (e) {
      console.error('Error checking cookie support:', e);
      return false;
    }
  },
  
  /**
   * Show warning if cookies are disabled
   */
  showCookieWarning: function() {
    console.warn('Cookies are disabled. Tracking functionality will be limited.');
    
    // Create warning element
    const warningEl = document.createElement('div');
    warningEl.className = 'cookie-warning';
    warningEl.innerHTML = `
      <div class="container">
        <p><strong>Cookies are disabled in your browser.</strong> To fully experience this scavenger hunt and track your progress, please enable cookies.</p>
      </div>
    `;
    
    // Style the warning
    warningEl.style.backgroundColor = '#E7222E';
    warningEl.style.color = '#FFFFFF';
    warningEl.style.padding = '10px 0';
    warningEl.style.textAlign = 'center';
    
    // Add to page
    document.body.insertBefore(warningEl, document.body.firstChild);
  },
  
  /**
   * Load user data from cookies
   */
  loadUserData: function() {
    const cookieData = this.getCookie(this.config.cookieName);
    
    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData);
        this.userData = {
          ...this.userData,
          ...parsedData
        };
        console.log('Loaded user data from cookie:', this.userData);
      } catch (e) {
        console.error('Error parsing cookie data:', e);
        // Reset cookie if it's invalid
        this.saveUserData();
      }
    }
  },
  
  /**
   * Save user data to cookies
   */
  saveUserData: function() {
    const dataString = JSON.stringify(this.userData);
    this.setCookie(this.config.cookieName, dataString, this.config.cookieExpiration);
    console.log('Saved user data to cookie:', this.userData);
  },
  
  /**
   * Track the current page visit
   */
  trackCurrentPageVisit: function() {
    // Get current neighborhood from URL path
    const pathSegments = window.location.pathname.split('/');
    const htmlFilename = pathSegments[pathSegments.length - 1];
    const currentNeighborhood = htmlFilename.replace('.html', '');
    
    // Check if this is a valid neighborhood page
    if (this.config.neighborhoods.includes(currentNeighborhood)) {
      // Check if we've already visited this location
      if (!this.userData.visitedLocations.includes(currentNeighborhood)) {
        this.userData.visitedLocations.push(currentNeighborhood);
        this.saveUserData();
        console.log(`Tracked visit to ${currentNeighborhood}`);
        
        // Show a welcome message for this location
        this.showLocationWelcome(currentNeighborhood);
      }
    }
  },
  
  /**
   * Show welcome message for a newly visited location
   * @param {string} neighborhood - The neighborhood being visited
   */
  showLocationWelcome: function(neighborhood) {
    // Create welcome notification
    const welcomeEl = document.createElement('div');
    welcomeEl.className = 'location-welcome';
    
    const neighborhoodName = neighborhood.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    welcomeEl.innerHTML = `
      <div class="welcome-content">
        <h3>Welcome to ${neighborhoodName}!</h3>
        <p>You've visited ${this.userData.visitedLocations.length} out of ${this.config.neighborhoods.length} locations.</p>
        <button class="close-welcome">Continue</button>
      </div>
    `;
    
    // Style the welcome notification
    welcomeEl.style.position = 'fixed';
    welcomeEl.style.top = '0';
    welcomeEl.style.left = '0';
    welcomeEl.style.right = '0';
    welcomeEl.style.bottom = '0';
    welcomeEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    welcomeEl.style.display = 'flex';
    welcomeEl.style.alignItems = 'center';
    welcomeEl.style.justifyContent = 'center';
    welcomeEl.style.zIndex = '1000';
    
    const welcomeContent = welcomeEl.querySelector('.welcome-content');
    welcomeContent.style.backgroundColor = '#FFFFFF';
    welcomeContent.style.padding = '30px';
    welcomeContent.style.borderRadius = '8px';
    welcomeContent.style.maxWidth = '500px';
    welcomeContent.style.textAlign = 'center';
    
    const closeButton = welcomeEl.querySelector('.close-welcome');
    closeButton.style.backgroundColor = '#009ADA';
    closeButton.style.color = '#FFFFFF';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.marginTop = '20px';
    closeButton.style.cursor = 'pointer';
    
    // Add to page
    document.body.appendChild(welcomeEl);
    
    // Add event listener to close button
    closeButton.addEventListener('click', function() {
      document.body.removeChild(welcomeEl);
    });
  },
  
  /**
   * Check if we should show any forms based on visit count
   */
  checkFormsToShow: function() {
    const visitCount = this.userData.visitedLocations.length;
    
    // Check if we should show the name form
    if (visitCount >= this.config.formThreshold.name && !this.userData.name) {
      this.showNameForm();
    }
    
    // Check if we should show the email form
    if (visitCount >= this.config.formThreshold.email && !this.userData.email && this.userData.name) {
      this.showEmailForm();
    }
  },
  
  /**
   * Show the name collection form
   */
  showNameForm: function() {
    // Create form element
    const formEl = document.createElement('div');
    formEl.className = 'user-form name-form';
    formEl.innerHTML = `
      <div class="form-content">
        <h3>You've visited ${this.userData.visitedLocations.length} locations!</h3>
        <p>Please tell us your name to continue the scavenger hunt.</p>
        <form id="nameForm">
          <div class="form-group">
            <label for="userName">Your Name</label>
            <input type="text" id="userName" name="userName" required>
            <div class="form-error" id="nameError"></div>
          </div>
          <button type="submit" class="btn btn-primary">Continue</button>
        </form>
      </div>
    `;
    
    // Style the form
    this.styleFormOverlay(formEl);
    
    // Add to page
    document.body.appendChild(formEl);
    
    // Add event listener to form submission
    document.getElementById('nameForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('userName');
      const nameError = document.getElementById('nameError');
      
      // Validate name
      if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please enter a valid name (at least 2 characters)';
        return;
      }
      
      // Save name
      this.userData.name = nameInput.value.trim();
      this.saveUserData();
      
      // Remove form
      document.body.removeChild(formEl);
      
      // Check if we should show email form
      if (this.userData.visitedLocations.length >= this.config.formThreshold.email) {
        this.showEmailForm();
      }
    });
  },
  
  /**
   * Show the email collection form
   */
  showEmailForm: function() {
    // Create form element
    const formEl = document.createElement('div');
    formEl.className = 'user-form email-form';
    formEl.innerHTML = `
      <div class="form-content">
        <h3>Congratulations, ${this.userData.name}!</h3>
        <p>You've completed the BMW Charity Scavenger Hunt! Please provide your email to enter the prize drawing.</p>
        <form id="emailForm">
          <div class="form-group">
            <label for="userEmail">Your Email</label>
            <input type="email" id="userEmail" name="userEmail" required>
            <div class="form-error" id="emailError"></div>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    `;
    
    // Style the form
    this.styleFormOverlay(formEl);
    
    // Add to page
    document.body.appendChild(formEl);
    
    // Add event listener to form submission
    document.getElementById('emailForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('userEmail');
      const emailError = document.getElementById('emailError');
      
      // Validate email
      if (!this.validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        return;
      }
      
      // Save email
      this.userData.email = emailInput.value.trim();
      this.saveUserData();
      
      // Remove form
      document.body.removeChild(formEl);
      
      // Show thank you message
      this.showThankYouMessage();
    });
  },
  
  /**
   * Style a form overlay element
   * @param {HTMLElement} formEl - The form element to style
   */
  styleFormOverlay: function(formEl) {
    formEl.style.position = 'fixed';
    formEl.style.top = '0';
    formEl.style.left = '0';
    formEl.style.right = '0';
    formEl.style.bottom = '0';
    formEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    formEl.style.display = 'flex';
    formEl.style.alignItems = 'center';
    formEl.style.justifyContent = 'center';
    formEl.style.zIndex = '1000';
    
    const formContent = formEl.querySelector('.form-content');
    formContent.style.backgroundColor = '#FFFFFF';
    formContent.style.padding = '30px';
    formContent.style.borderRadius = '8px';
    formContent.style.maxWidth = '500px';
    formContent.style.width = '90%';
  },
  
  /**
   * Show thank you message after completing the hunt
   */
  showThankYouMessage: function() {
    // Create thank you element
    const thankYouEl = document.createElement('div');
    thankYouEl.className = 'thank-you-message';
    thankYouEl.innerHTML = `
      <div class="thank-you-content">
        <h3>Thank You, ${this.userData.name}!</h3>
        <p>Your entry has been recorded. Winners will be notified via email.</p>
        <p>Thank you for participating in the BMW Charity Scavenger Hunt!</p>
        <button class="close-thank-you">Close</button>
      </div>
    `;
    
    // Style the thank you message
    thankYouEl.style.position = 'fixed';
    thankYouEl.style.top = '0';
    thankYouEl.style.left = '0';
    thankYouEl.style.right = '0';
    thankYouEl.style.bottom = '0';
    thankYouEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    thankYouEl.style.display = 'flex';
    thankYouEl.style.alignItems = 'center';
    thankYouEl.style.justifyContent = 'center';
    thankYouEl.style.zIndex = '1000';
    
    const thankYouContent = thankYouEl.querySelector('.thank-you-content');
    thankYouContent.style.backgroundColor = '#FFFFFF';
    thankYouContent.style.padding = '30px';
    thankYouContent.style.borderRadius = '8px';
    thankYouContent.style.maxWidth = '500px';
    thankYouContent.style.textAlign = 'center';
    
    const closeButton = thankYouEl.querySelector('.close-thank-you');
    closeButton.style.backgroundColor = '#009ADA';
    closeButton.style.color = '#FFFFFF';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.marginTop = '20px';
    closeButton.style.cursor = 'pointer';
    
    // Add to page
    document.body.appendChild(thankYouEl);
    
    // Add event listener to close button
    closeButton.addEventListener('click', function() {
      document.body.removeChild(thankYouEl);
    });
    
    // Also send data to server (would be implemented in a real scenario)
    console.log('Would send data to server:', this.userData);
  },
  
  /**
   * Set up event listeners
   */
  setupEventListeners: function() {
    // Add event listeners for navigation links to track page changes in SPA scenarios
    document.addEventListener('click', (e) => {
      // Check if the clicked element is a navigation link
      if (e.target.tagName === 'A' && e.target.href.includes(window.location.hostname)) {
        // Store the current state before navigation
        this.saveUserData();
      }
    });
  },
  
  /**
   * Validate an email address
   * @param {string} email - The email to validate
   * @returns {boolean} True if the email is valid
   */
  validateEmail: function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  
  /**
   * Set a cookie
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Days until expiration
   */
  setCookie: function(name, value, days) {
    let expires = '';
    
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Strict';
  },
  
  /**
   * Get a cookie by name
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null if not found
   */
  getCookie: function(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    
    return null;
  },
  
  /**
   * Delete a cookie
   * @param {string} name - Cookie name
   */
  deleteCookie: function(name) {
    this.setCookie(name, '', -1);
  },
  
  /**
   * Get the progress of the scavenger hunt
   * @returns {Object} Progress information
   */
  getProgress: function() {
    return {
      visitedLocations: this.userData.visitedLocations,
      totalLocations: this.config.neighborhoods.length,
      completionPercentage: (this.userData.visitedLocations.length / this.config.neighborhoods.length) * 100,
      isComplete: this.userData.visitedLocations.length >= this.config.neighborhoods.length
    };
  },
  
  /**
   * Display the user's progress in a specified element
   * @param {string} elementId - ID of the element to display progress in
   */
  displayProgress: function(elementId) {
    const progressEl = document.getElementById(elementId);
    if (!progressEl) return;
    
    const progress = this.getProgress();
    
    progressEl.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress.completionPercentage}%"></div>
      </div>
      <p>You've visited ${progress.visitedLocations.length} out of ${progress.totalLocations} locations.</p>
    `;
  }
};

// Initialize tracking when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  BMWScavengerHunt.init();
  
  // If there's a progress element on the page, display progress
  if (document.getElementById('hunt-progress')) {
    BMWScavengerHunt.displayProgress('hunt-progress');
  }
});