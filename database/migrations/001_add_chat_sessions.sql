-- Migration: Add chat_sessions table
-- Created: 2025-10-24
-- Purpose: Store chat conversation history for the LOIS assistant

-- ============================================================================
-- CHAT SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]', -- Array of message objects
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID, -- References auth.users in production (optional for now)
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Optional link to a case
    is_archived BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON chat_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_is_archived ON chat_sessions(is_archived);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_messages ON chat_sessions USING GIN(messages);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE chat_sessions IS 'Stores chat conversation history with the LOIS assistant';
COMMENT ON COLUMN chat_sessions.messages IS 'JSONB array of message objects with role, content, timestamp, etc.';
COMMENT ON COLUMN chat_sessions.last_message_at IS 'Timestamp of the last message in the conversation (for sorting)';
COMMENT ON COLUMN chat_sessions.metadata IS 'Additional metadata like tags, pinned status, etc.';
