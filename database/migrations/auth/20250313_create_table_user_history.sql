CREATE TABLE user_history (
    history_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    changed_by INT NOT NULL REFERENCES users(user_id),
    change_type VARCHAR(10) NOT NULL CHECK (change_type IN ('INSERT', 'UPDATE', 'DELETE')),
    change_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB
);