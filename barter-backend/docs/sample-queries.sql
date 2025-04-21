-- Get all users
SELECT * FROM users;

-- Insert a new item
INSERT INTO items (user_id, name, description, category, condition)
VALUES (1, 'Book', 'A used book', 'Books', 'Good');

-- Update an offer status
UPDATE offers SET status = 'accepted' WHERE id = 3;

-- Delete an item
DELETE FROM items WHERE id = 10;

-- Get all available items
SELECT * FROM items WHERE is_available = TRUE;

-- Get all offers for a user
SELECT * FROM offers WHERE from_user_id = 1 OR to_user_id = 1;

-- Join: Get all trades with offer and user info
SELECT t.*, o.*, u.username AS from_username, u2.username AS to_username
FROM trades t
JOIN offers o ON t.offer_id = o.id
JOIN users u ON o.from_user_id = u.id
JOIN users u2 ON o.to_user_id = u2.id;
