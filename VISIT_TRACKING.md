# Visit Tracking System

This document explains how the visit tracking system works in the BMW Digital Passport platform.

## Overview

The visit tracking system has been restructured so that **every visit to a location creates a database entry**, regardless of whether the user is registered or not. This provides comprehensive analytics and tracking capabilities.

## Database Schema

### New `visits` Table

```sql
CREATE TABLE visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_id INT,
  session_id VARCHAR(255), -- Anonymous session identifier
  user_id CHAR(36) NULL, -- NULL if user not registered
  ip_address VARCHAR(45), -- IPv4 or IPv6
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Key Features

- **Anonymous Tracking**: Uses `session_id` to track unregistered users
- **User Association**: Links visits to registered users when available
- **IP Tracking**: Records IP addresses for analytics
- **User Agent**: Stores browser/device information
- **Timestamps**: Automatic timestamp for each visit

## API Endpoints

### POST `/api/visit`
Track a visit to a location

**Request Body:**
```json
{
  "location_id": 1,
  "session_id": "session_abc123",
  "user_id": "uuid-optional"
}
```

**Response:**
```json
{
  "success": true,
  "visit_id": 123,
  "session_id": "session_abc123"
}
```

### GET `/api/visit/stats/:location_id`
Get visit statistics for a location

**Response:**
```json
{
  "location_id": 1,
  "total_visits": 150,
  "unique_visitors": 89,
  "registered_visitors": 45,
  "visits_per_day": [...]
}
```

### GET `/api/visit/user/:user_id`
Get all visits for a registered user

**Response:**
```json
{
  "visits": [
    {
      "id": 1,
      "location_id": 1,
      "location_name": "Lawrenceville",
      "timestamp": "2024-01-15T10:30:00Z",
      ...
    }
  ]
}
```

## Frontend Integration

### Visit Tracker Utility

The `visitTracker.js` utility handles:
- Session ID generation and management
- Automatic visit tracking on page load
- API communication for visit logging

### Usage in Components

```javascript
import visitTracker from '../visitTracker';

// In a component
useEffect(() => {
  if (slug) {
    visitTracker.trackVisit(slug);
  }
}, [slug]);
```

## Admin Dashboard

The admin dashboard now includes visit statistics:
- Total visits across all locations
- Unique visitors (by session)
- Visits per location
- Daily visit trends
- Comparison between registered and anonymous users

## Setup Instructions

1. **Update Database Schema:**
   ```bash
   # Run the updated schema.sql
   mysql -u username -p database_name < backend/schema.sql
   ```

2. **Populate Locations:**
   ```bash
   cd backend
   npm run populate-locations
   ```

3. **Start the Backend:**
   ```bash
   npm run dev
   ```

## Analytics Benefits

With this new system, you can now track:

- **Total Engagement**: Every page visit is recorded
- **User Journey**: Track how users move between locations
- **Conversion Rates**: Compare anonymous visits to registrations
- **Popular Locations**: See which neighborhoods get the most traffic
- **Time-based Patterns**: Analyze when users are most active
- **Device Analytics**: Track user agents and IP patterns

## Privacy Considerations

- IP addresses are stored for analytics but can be anonymized
- Session IDs are used for anonymous tracking
- Users can opt out via cookie consent
- GDPR compliance through cookie banner

## Migration from Old System

The old stamp-based system remains intact for registered users, while the new visit system provides comprehensive tracking for all users. This ensures backward compatibility while adding new capabilities. 