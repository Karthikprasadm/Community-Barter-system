-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    reputation FLOAT DEFAULT 0,
    joined_date DATE DEFAULT CURRENT_DATE
);

-- Items Table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100),
    description TEXT,
    category VARCHAR(50),
    condition VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    posted_date DATE DEFAULT CURRENT_DATE
);

-- Offers Table
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    item_offered_id INTEGER REFERENCES items(id),
    item_requested_id INTEGER REFERENCES items(id),
    status VARCHAR(20) DEFAULT 'pending',
    offer_date DATE DEFAULT CURRENT_DATE
);

-- Trades Table
CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    offer_id INTEGER REFERENCES offers(id),
    trade_date DATE DEFAULT CURRENT_DATE,
    notes TEXT
);

-- Ratings Table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    rater_id INTEGER REFERENCES users(id),
    trade_id INTEGER REFERENCES trades(id),
    rating_value INTEGER CHECK (rating_value BETWEEN 1 AND 5),
    comment TEXT,
    rating_date DATE DEFAULT CURRENT_DATE
);

-- Admins Table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    is_head_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
