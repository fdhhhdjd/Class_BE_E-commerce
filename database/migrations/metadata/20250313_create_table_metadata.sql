CREATE TABLE metadata (
    metadata_id SMALLSERIAL PRIMARY KEY,
    address TEXT CHECK (LENGTH(address) >= 5),
    email VARCHAR(100) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(15) CHECK (phone ~ '^\+?[0-9]{8,15}$'),
    working_hours VARCHAR(50) NOT NULL DEFAULT '08:00 - 17:30, Mon - Fri',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
) WITH (fillfactor = 95);

CREATE INDEX idx_metadata_email ON metadata USING HASH (email);
CREATE INDEX idx_metadata_phone ON metadata USING HASH (phone);
CREATE INDEX idx_metadata_is_active ON metadata (is_active);

