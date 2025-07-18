CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255)
);

CREATE TABLE locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  store_id INT,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  store_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE stamps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  location_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- New table to track every visit
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