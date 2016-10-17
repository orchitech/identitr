CREATE TABLE score(
  id SERIAL PRIMARY KEY,
  uid TEXT,
  name TEXT,
  score INT NOT NULL,
  play_time INT,
  user_agent TEXT,
  ip_address TEXT,
  hidden BOOLEAN,
  created_on TIMESTAMP DEFAULT NOW()
);
