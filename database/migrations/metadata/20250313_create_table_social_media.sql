CREATE TYPE social_platform AS ENUM ('Facebook', 'Twitter', 'Instagram', 'YouTube', 'LinkedIn');

CREATE TABLE social_media (
    social_id SERIAL PRIMARY KEY,
    platform social_platform NOT NULL,
    url VARCHAR(255) NOT NULL CHECK (url ~* '^https?://(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$'),
    metadata_id SMALLINT NOT NULL REFERENCES metadata(metadata_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT unique_social_platform UNIQUE (platform, metadata_id)
) WITH (fillfactor = 95);

CREATE INDEX idx_social_media_platform ON social_media USING HASH (platform);
CREATE INDEX idx_social_media_metadata_id ON social_media (metadata_id);
CREATE INDEX idx_social_media_is_active ON social_media (is_active);