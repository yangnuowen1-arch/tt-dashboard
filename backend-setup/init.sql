-- TT Admin Dashboard Database Initialization Script
-- Run: psql postgres -f init.sql

-- Create database
CREATE DATABASE tt_admin;

-- Create user (change password to your own)
CREATE USER tt_admin_user WITH PASSWORD 'tt_admin_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tt_admin TO tt_admin_user;

-- Connect to the database
\c tt_admin

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO tt_admin_user;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookup
CREATE INDEX idx_users_email ON users(email);

-- Insert a test user (password: test123, will be hashed in NestJS)
-- This is just for testing connection, real password hashing will be done in backend
INSERT INTO users (email, password, name, role) VALUES
    ('admin@test.com', 'placeholder_hash', 'Admin User', 'admin'),
    ('user@test.com', 'placeholder_hash', 'Test User', 'user');

-- Show created tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Show table structure
\d users

-- Success message
\echo 'Database tt_admin created successfully!'
\echo 'Tables: users'
\echo 'Test users inserted'