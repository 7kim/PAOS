-- Code-SRS Database Schema
-- PostgreSQL 18

-- ── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  display_name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'email' NOT NULL,  -- 'email', 'github', 'google'
  provider_id TEXT,                         -- OAuth provider user ID
  invite_code TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,        -- 'user', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);

-- ── Sessions table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- ── Pipelines table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pipelines (
  id TEXT PRIMARY KEY,                     -- e.g. PIPE-xxxxxxxx-xxxx
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  model_alias TEXT NOT NULL,
  model_id TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' NOT NULL, -- submitted, running, complete, failed
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pipelines_user_id ON pipelines(user_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_status ON pipelines(status);

-- ── Invite codes table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invite_codes (
  code TEXT PRIMARY KEY,
  description TEXT,
  max_uses INTEGER DEFAULT 0,              -- 0 = unlimited
  use_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed default invite codes
INSERT INTO invite_codes (code, description, max_uses)
VALUES
  ('CODE-SRS-2026', 'Early access invite code', 100),
  ('PREVIEW', 'Preview access invite code', 50)
ON CONFLICT (code) DO NOTHING;
