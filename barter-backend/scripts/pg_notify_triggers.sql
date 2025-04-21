-- PostgreSQL triggers and functions for real-time NOTIFY on all major tables

-- ITEMS
CREATE OR REPLACE FUNCTION notify_item_change() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    payload = row_to_json(OLD);
  ELSE
    payload = row_to_json(NEW);
  END IF;
  PERFORM pg_notify('item_changes', json_build_object('operation', TG_OP, 'data', payload)::text);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS item_change_trigger ON "Item";
CREATE TRIGGER item_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Item"
FOR EACH ROW EXECUTE FUNCTION notify_item_change();

-- USERS
CREATE OR REPLACE FUNCTION notify_user_change() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    payload = row_to_json(OLD);
  ELSE
    payload = row_to_json(NEW);
  END IF;
  PERFORM pg_notify('user_changes', json_build_object('operation', TG_OP, 'data', payload)::text);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_change_trigger ON "User";
CREATE TRIGGER user_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON "User"
FOR EACH ROW EXECUTE FUNCTION notify_user_change();

-- TRADES
CREATE OR REPLACE FUNCTION notify_trade_change() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    payload = row_to_json(OLD);
  ELSE
    payload = row_to_json(NEW);
  END IF;
  PERFORM pg_notify('trade_changes', json_build_object('operation', TG_OP, 'data', payload)::text);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trade_change_trigger ON "Trade";
CREATE TRIGGER trade_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Trade"
FOR EACH ROW EXECUTE FUNCTION notify_trade_change();

-- OFFERS
CREATE OR REPLACE FUNCTION notify_offer_change() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    payload = row_to_json(OLD);
  ELSE
    payload = row_to_json(NEW);
  END IF;
  PERFORM pg_notify('offer_changes', json_build_object('operation', TG_OP, 'data', payload)::text);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS offer_change_trigger ON "Offer";
CREATE TRIGGER offer_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Offer"
FOR EACH ROW EXECUTE FUNCTION notify_offer_change();

-- RATINGS
CREATE OR REPLACE FUNCTION notify_rating_change() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    payload = row_to_json(OLD);
  ELSE
    payload = row_to_json(NEW);
  END IF;
  PERFORM pg_notify('rating_changes', json_build_object('operation', TG_OP, 'data', payload)::text);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rating_change_trigger ON "Rating";
CREATE TRIGGER rating_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Rating"
FOR EACH ROW EXECUTE FUNCTION notify_rating_change();
