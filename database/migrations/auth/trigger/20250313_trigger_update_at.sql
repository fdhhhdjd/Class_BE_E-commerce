CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER update_permissions_timestamp
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_roles_timestamp
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_role_permissions_timestamp
BEFORE UPDATE ON role_permissions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_roles_timestamp
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
