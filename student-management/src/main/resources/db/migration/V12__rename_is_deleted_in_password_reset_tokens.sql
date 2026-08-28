ALTER TABLE password_reset_tokens CHANGE COLUMN is_deleted deleted BOOLEAN NOT NULL DEFAULT FALSE;
