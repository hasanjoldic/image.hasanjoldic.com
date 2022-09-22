CREATE TABLE IF NOT EXISTS mime_type (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  value TEXT UNIQUE NOT NULL,
  ext TEXT UNIQUE NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON mime_type(value);
CREATE INDEX ON mime_type(created_at);
CREATE INDEX ON mime_type(updated_at);

DROP TRIGGER IF EXISTS a_mime_type_timestamp_trigger ON mime_type;
CREATE TRIGGER a_mime_type_timestamp_trigger
  BEFORE UPDATE ON mime_type
  FOR EACH ROW EXECUTE PROCEDURE timestamp_trigger();
