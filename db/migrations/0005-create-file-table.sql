CREATE TABLE IF NOT EXISTS file (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mime_type_id UUID REFERENCES mime_type(id) NOT NULL,

  sha_256_hash TEXT UNIQUE NOT NULL,

  is_private BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON file(mime_type_id);
CREATE INDEX ON file(sha_256_hash);
CREATE INDEX ON file(is_private);
CREATE INDEX ON file(created_at);
CREATE INDEX ON file(updated_at);

DROP TRIGGER IF EXISTS a_file_timestamp_trigger ON file;
CREATE TRIGGER a_file_timestamp_trigger
  BEFORE UPDATE ON file
  FOR EACH ROW EXECUTE PROCEDURE timestamp_trigger();