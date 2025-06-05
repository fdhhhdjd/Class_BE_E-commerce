CREATE TABLE device (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    device_token TEXT NOT NULL,
    platform VARCHAR(20) CHECK (platform IN ('android', 'ios', 'web')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
