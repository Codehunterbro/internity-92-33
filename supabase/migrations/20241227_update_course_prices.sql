
-- Update all courses to have a price of ₹3500
UPDATE courses 
SET price_inr = 3500, 
    price = 42,  -- Approximate USD equivalent (3500/83)
    updated_at = now()
WHERE price_inr IS DISTINCT FROM 3500;
