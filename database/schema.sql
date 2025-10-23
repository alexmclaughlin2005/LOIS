-- LOIS Legal Case Management System - Database Schema
-- PostgreSQL/Supabase compatible
-- Created: 2025-10-23

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Projects (Legal Cases) - Atomic Unit
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    case_type VARCHAR(100) NOT NULL, -- 'Personal Injury', 'Corporate', 'Family Law', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'Open', -- 'Open', 'Closed', 'On Hold'
    phase VARCHAR(100), -- 'Discovery', 'Trial', 'Settlement', 'Appeal'
    jurisdiction VARCHAR(100),
    court_name VARCHAR(255),
    filing_date DATE,
    estimated_value DECIMAL(12, 2),
    priority VARCHAR(20) DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    custom_fields JSONB DEFAULT '{}', -- Case-specific fields
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- References auth.users in production
    assigned_attorney UUID -- References auth.users in production
);

-- Contacts (Attorneys, Clients, Witnesses, Experts)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    contact_type VARCHAR(50) NOT NULL, -- 'Attorney', 'Client', 'Opposing Counsel', 'Witness', 'Expert', 'Judge'
    organization VARCHAR(255),
    title VARCHAR(100),
    bar_number VARCHAR(50), -- For attorneys
    specialty VARCHAR(100), -- For experts
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for many-to-many relationship between Projects and Contacts
CREATE TABLE project_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- 'Lead Attorney', 'Plaintiff', 'Defendant', 'Expert Witness', etc.
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, contact_id, role)
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'Pleading', 'Discovery', 'Correspondence', 'Evidence', 'Contract', 'Motion'
    file_name VARCHAR(255),
    file_path VARCHAR(500), -- For future file storage
    file_size_kb INTEGER,
    mime_type VARCHAR(100),
    content TEXT, -- Mock short content for demo
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Final', 'Filed', 'Received'
    date_filed DATE,
    date_received DATE,
    uploaded_by UUID, -- References auth.users
    tags VARCHAR(255)[], -- Array of tags
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Entries
CREATE TABLE calendar_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    entry_type VARCHAR(100) NOT NULL, -- 'Court Date', 'Deposition', 'Deadline', 'Meeting', 'Hearing'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    location VARCHAR(255),
    description TEXT,
    attendees UUID[], -- Array of contact IDs
    reminder_minutes INTEGER, -- Minutes before event to remind
    is_all_day BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled', 'Rescheduled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    note_type VARCHAR(100) DEFAULT 'General', -- 'Case Note', 'Strategy', 'Meeting Note', 'Phone Call', 'Research'
    author UUID, -- References auth.users
    is_pinned BOOLEAN DEFAULT FALSE,
    tags VARCHAR(100)[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(100) DEFAULT 'General', -- 'To-Do', 'Follow-Up', 'Review', 'Research', 'Filing'
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed', 'Cancelled'
    priority VARCHAR(20) DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    assigned_to UUID, -- References auth.users
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by UUID, -- References auth.users
    parent_task_id UUID REFERENCES tasks(id), -- For subtasks
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BILLING ENTITIES
-- ============================================================================

-- Time Entries
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    attorney UUID NOT NULL, -- References auth.users
    date DATE NOT NULL,
    hours DECIMAL(5, 2) NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'Research', 'Client Meeting', 'Court Appearance', 'Document Prep', etc.
    description TEXT NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (hours * hourly_rate) STORED,
    is_billable BOOLEAN DEFAULT TRUE,
    invoice_id UUID, -- References invoices(id) - added after invoice generation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    expense_type VARCHAR(100) NOT NULL, -- 'Court Filing Fee', 'Expert Fee', 'Travel', 'Document Production', etc.
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    vendor VARCHAR(255),
    receipt_file_path VARCHAR(500),
    is_billable BOOLEAN DEFAULT TRUE,
    invoice_id UUID, -- References invoices(id)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    payment_date DATE,
    payment_method VARCHAR(50), -- 'Check', 'Wire Transfer', 'Credit Card', 'ACH'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Projects indexes
CREATE INDEX idx_projects_case_number ON projects(case_number);
CREATE INDEX idx_projects_case_type ON projects(case_type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_assigned_attorney ON projects(assigned_attorney);
CREATE INDEX idx_projects_custom_fields ON projects USING GIN(custom_fields);

-- Contacts indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_contact_type ON contacts(contact_type);
CREATE INDEX idx_contacts_last_name ON contacts(last_name);

-- Project contacts indexes
CREATE INDEX idx_project_contacts_project ON project_contacts(project_id);
CREATE INDEX idx_project_contacts_contact ON project_contacts(contact_id);
CREATE INDEX idx_project_contacts_role ON project_contacts(role);

-- Documents indexes
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_content_fts ON documents USING GIN(to_tsvector('english', content));

-- Calendar indexes
CREATE INDEX idx_calendar_project ON calendar_entries(project_id);
CREATE INDEX idx_calendar_start_time ON calendar_entries(start_time);
CREATE INDEX idx_calendar_type ON calendar_entries(entry_type);

-- Notes indexes
CREATE INDEX idx_notes_project ON notes(project_id);
CREATE INDEX idx_notes_type ON notes(note_type);
CREATE INDEX idx_notes_author ON notes(author);
CREATE INDEX idx_notes_content_fts ON notes USING GIN(to_tsvector('english', content));

-- Tasks indexes
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);

-- Time entries indexes
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_attorney ON time_entries(attorney);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_time_entries_invoice ON time_entries(invoice_id);

-- Expenses indexes
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_invoice ON expenses(invoice_id);

-- Invoices indexes
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_entries_updated_at BEFORE UPDATE ON calendar_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE QUERIES (for testing)
-- ============================================================================

-- Query 1: All open personal injury cases in discovery phase
-- SELECT * FROM projects
-- WHERE status = 'Open'
-- AND case_type = 'Personal Injury'
-- AND phase = 'Discovery';

-- Query 2: Cases with medical expenses > $100,000
-- SELECT * FROM projects
-- WHERE case_type = 'Personal Injury'
-- AND (custom_fields->>'medical_expenses')::numeric > 100000;

-- Query 3: Upcoming deadlines in next 7 days
-- SELECT p.case_number, p.title, c.title as deadline, c.start_time
-- FROM calendar_entries c
-- JOIN projects p ON c.project_id = p.id
-- WHERE c.entry_type = 'Deadline'
-- AND c.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days'
-- ORDER BY c.start_time;

-- Query 4: Total billable hours by project
-- SELECT p.case_number, p.title, SUM(te.hours) as total_hours, SUM(te.total_amount) as total_fees
-- FROM time_entries te
-- JOIN projects p ON te.project_id = p.id
-- WHERE te.is_billable = TRUE
-- GROUP BY p.id, p.case_number, p.title
-- ORDER BY total_fees DESC;

-- Query 5: Full-text search across documents
-- SELECT p.case_number, d.title, d.document_type
-- FROM documents d
-- JOIN projects p ON d.project_id = p.id
-- WHERE to_tsvector('english', d.content) @@ to_tsquery('english', 'settlement & damages');
