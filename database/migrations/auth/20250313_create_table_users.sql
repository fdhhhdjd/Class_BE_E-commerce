CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE CHECK (LENGTH(username) >= 5 AND username ~ '^[A-Za-z0-9_]+$'),
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 5),
    -- password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 8 AND password ~ '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    avatar_url VARCHAR(255),
    full_name VARCHAR(100),
    address TEXT,
    phone_number VARCHAR(15) CHECK (phone_number ~ '^\+?[0-9]{8,15}$'),
    last_login TIMESTAMPTZ,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
) WITH (fillfactor=90);

CREATE INDEX idx_users_email ON users USING HASH (email);
CREATE INDEX idx_users_phone ON users (phone_number);
CREATE INDEX idx_users_is_blocked ON users(is_blocked);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);
CREATE INDEX idx_users_username ON users(username);