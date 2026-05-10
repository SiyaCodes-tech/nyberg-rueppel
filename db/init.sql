CREATE TABLE key_pairs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  p TEXT NOT NULL,
  q TEXT NOT NULL,
  g TEXT NOT NULL,
  x TEXT NOT NULL,
  y TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE signatures (
  id SERIAL PRIMARY KEY,
  key_pair_id INT REFERENCES key_pairs(id),
  message TEXT,
  r TEXT NOT NULL,
  s TEXT NOT NULL,
  signed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verifications (
  id SERIAL PRIMARY KEY,
  key_pair_id INT REFERENCES key_pairs(id),
  r TEXT NOT NULL,
  s TEXT NOT NULL,
  recovered_message TEXT,
  is_valid BOOLEAN,
  verified_at TIMESTAMP DEFAULT NOW()
);
