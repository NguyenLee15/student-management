-- V17: Add teacher_id column to users table for linking teacher accounts
ALTER TABLE users ADD COLUMN IF NOT EXISTS teacher_id VARCHAR(50) NULL;
