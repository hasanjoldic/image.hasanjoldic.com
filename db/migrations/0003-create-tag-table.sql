CREATE TABLE IF NOT EXISTS tag (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES tag(id),

  title VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON tag(parent_id);
CREATE INDEX ON tag(title);
CREATE INDEX ON tag(created_at);
CREATE INDEX ON tag(updated_at);

DROP TRIGGER IF EXISTS a_tag_timestamp_trigger ON tag;
CREATE TRIGGER a_tag_timestamp_trigger
  BEFORE UPDATE ON tag
  FOR EACH ROW EXECUTE PROCEDURE timestamp_trigger();