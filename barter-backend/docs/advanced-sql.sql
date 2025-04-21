SELECT 
  u.username,
  COUNT(i.id) AS item_count,
  RANK() OVER (ORDER BY COUNT(i.id) DESC) AS item_rank
FROM "User" u
LEFT JOIN "Item" i ON u.id = i."userId"
GROUP BY u.username;