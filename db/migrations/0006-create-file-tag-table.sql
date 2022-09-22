CREATE TABLE IF NOT EXISTS file_tag (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  tag_id UUID REFERENCES tag(id) NOT NULL,
  file_id UUID REFERENCES file(id) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON file_tag(tag_id);
CREATE INDEX ON file_tag(file_id);
CREATE INDEX ON file_tag(created_at);
CREATE INDEX ON file_tag(updated_at);

DROP TRIGGER IF EXISTS a_file_tag_timestamp_trigger ON file_tag;
CREATE TRIGGER a_file_tag_timestamp_trigger
  BEFORE UPDATE ON file_tag
  FOR EACH ROW EXECUTE PROCEDURE timestamp_trigger();