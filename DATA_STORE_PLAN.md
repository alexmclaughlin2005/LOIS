# LOIS Legal Case Management - Data Store Plan

## Overview

This document outlines the comprehensive data architecture for a high-fidelity prototype of a legal case management system. The data store is designed to support realistic queries through a conversational chat interface, with **Projects (Legal Cases)** as the atomic unit connecting all data points.

**Purpose**: Create a rich, interconnected dataset that simulates a real legal practice for prototype testing and demonstration.

**Last Updated**: October 23, 2025

---

## Table of Contents

1. [Data Architecture Overview](#data-architecture-overview)
2. [Core Entities](#core-entities)
3. [Database Schema](#database-schema)
4. [Entity Relationships](#entity-relationships)
5. [Sample Data Specifications](#sample-data-specifications)
6. [Data Generation Strategy](#data-generation-strategy)
7. [Query Patterns](#query-patterns)
8. [Implementation Plan](#implementation-plan)

---

## Data Architecture Overview

### Atomic Unit: Project (Legal Case)

Every data entity in the system connects back to a **Project**, which represents a legal case. This creates a hierarchical, interconnected data structure that mirrors real legal practice.

### Data Entity Hierarchy

```
PROJECT (Legal Case) - Atomic Unit
├── PROJECT METADATA
│   ├── Case Type (Personal Injury, Corporate, Criminal, etc.)
│   ├── Status (Active, Discovery, Trial, Settled, Closed)
│   ├── Priority (High, Medium, Low)
│   ├── Phase (Intake, Discovery, Pre-Trial, Trial, Appeal, Settlement, Closed)
│   ├── Custom Fields (Medical Expenses, Settlement Amount, Statute Date, etc.)
│   └── Dates (Filed, Last Activity, Statute Deadline, Trial Date)
│
├── CONTACTS (Attorneys, Clients, Opposing Counsel, Witnesses, Experts)
│   ├── Internal Team (Lead Attorney, Associate Attorneys, Paralegals)
│   ├── Clients (Primary Client, Additional Parties)
│   ├── Opposing Parties (Opposing Counsel, Defendants)
│   ├── Witnesses (Fact Witnesses, Expert Witnesses)
│   └── Related Contacts (Insurance Adjusters, Medical Providers, Court Staff)
│
├── DOCUMENTS
│   ├── Pleadings (Complaint, Answer, Motions)
│   ├── Discovery (Interrogatories, Requests for Production, Depositions)
│   ├── Correspondence (Client Letters, Opposing Counsel Communications)
│   ├── Evidence (Photos, Medical Records, Police Reports)
│   ├── Court Filings (Orders, Judgments, Briefs)
│   └── Internal Documents (Memos, Case Notes, Strategy Documents)
│
├── CALENDAR ENTRIES
│   ├── Court Dates (Hearings, Trials, Status Conferences)
│   ├── Deadlines (Discovery Deadlines, Filing Deadlines, SOL Dates)
│   ├── Client Meetings (Consultations, Case Updates)
│   ├── Internal Events (Team Meetings, Strategy Sessions)
│   └── Depositions (Witness Depositions, Expert Depositions)
│
├── NOTES & TASKS
│   ├── Case Notes (Strategy Notes, Meeting Notes, Call Notes)
│   ├── Tasks (To-Do Items, Follow-ups, Assignments)
│   ├── Internal Communications (Team Messages, Discussions)
│   └── Client Communications Log
│
├── TIME ENTRIES & BILLING
│   ├── Time Entries (Attorney Time, Paralegal Time, Admin Time)
│   ├── Expenses (Court Fees, Expert Fees, Travel, Filing Fees)
│   ├── Invoices (Billed Amounts, Payment Status)
│   └── Trust Account Transactions
│
└── CUSTOM FIELDS (Case-Specific Data)
    ├── Personal Injury Specific (Medical Expenses, Lost Wages, Injury Type)
    ├── Corporate Specific (Contract Value, Transaction Type)
    ├── Criminal Specific (Charges, Plea Offers, Sentencing)
    └── Family Law Specific (Children, Assets, Support)
```

---

## Core Entities

### 1. Projects (Legal Cases)

**Purpose**: The central entity representing a legal case. Everything connects to a project.

**Core Fields**:
- `id`: UUID (Primary Key)
- `case_number`: String (e.g., "CV-2024-001234")
- `name`: String (e.g., "Smith v. Jones Transportation")
- `case_type`: Enum (Personal Injury, Corporate, Criminal, Family, Immigration, etc.)
- `status`: Enum (Active, Pending, Discovery, Pre-Trial, Trial, Settled, Closed)
- `phase`: Enum (Intake, Investigation, Discovery, Mediation, Trial, Appeal, Closed)
- `priority`: Enum (High, Medium, Low)
- `lead_attorney_id`: FK → Contacts
- `client_id`: FK → Contacts
- `practice_area`: String (Litigation, Transactional, Advisory)
- `court`: String (e.g., "Superior Court of California, Los Angeles County")
- `judge`: String
- `opposing_counsel_id`: FK → Contacts
- `date_filed`: Date
- `date_opened`: Date
- `date_closed`: Date (nullable)
- `statute_date`: Date (Statute of Limitations deadline)
- `trial_date`: Date (nullable)
- `settlement_demand`: Decimal (nullable)
- `settlement_amount`: Decimal (nullable)
- `estimated_value`: Decimal
- `description`: Text
- `tags`: Array<String>
- `metadata`: JSONB (flexible field for case-specific data)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Custom Fields (JSONB in metadata)**:
- Personal Injury: `medical_expenses`, `lost_wages`, `injury_type`, `accident_date`, `liability_percentage`
- Corporate: `contract_value`, `transaction_type`, `closing_date`, `parties_involved`
- Criminal: `charges`, `plea_offer`, `bail_amount`, `sentencing_date`

**Sample Volume**: 150-200 projects covering various case types and statuses

---

### 2. Contacts (People & Organizations)

**Purpose**: All people and entities related to legal cases (clients, attorneys, witnesses, opposing parties, etc.)

**Core Fields**:
- `id`: UUID (Primary Key)
- `contact_type`: Enum (Internal Attorney, Internal Staff, Client, Opposing Counsel, Witness, Expert, Vendor, Court Staff, Insurance, Medical Provider)
- `entity_type`: Enum (Person, Organization)
- `first_name`: String
- `last_name`: String
- `organization_name`: String (for organizations)
- `email`: String
- `phone_primary`: String
- `phone_secondary`: String
- `address_line1`: String
- `address_line2`: String
- `city`: String
- `state`: String
- `zip`: String
- `title`: String (e.g., "Senior Partner", "Paralegal", "Expert Witness")
- `specialty`: String (for experts: "Orthopedic Surgery", "Economic Damages", etc.)
- `bar_number`: String (for attorneys)
- `firm`: String
- `rate_hourly`: Decimal (billing rate for internal staff)
- `notes`: Text
- `tags`: Array<String>
- `is_active`: Boolean
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Relationships**:
- `project_contacts`: Junction table linking contacts to projects with role specification

**Sample Volume**: 300-400 contacts
- 15-20 internal attorneys
- 10-15 internal staff (paralegals, admin)
- 150-200 clients
- 50-75 opposing counsel
- 30-50 witnesses
- 20-30 expert witnesses
- 30-50 other contacts

---

### 3. Documents

**Purpose**: All documents related to legal cases (pleadings, discovery, correspondence, evidence)

**Core Fields**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects
- `document_type`: Enum (Pleading, Discovery, Correspondence, Evidence, Court Filing, Internal Memo, Contract, Medical Record, Police Report, Expert Report, Other)
- `document_category`: String (more specific: "Motion to Compel", "Deposition Transcript", etc.)
- `title`: String
- `file_name`: String
- `file_type`: String (PDF, DOCX, JPG, etc.)
- `file_size`: Integer (bytes)
- `file_path`: String (simulated S3 path)
- `content_preview`: Text (first 500 chars of mock content)
- `full_content`: Text (mock full content - 2-5 paragraphs)
- `author_id`: FK → Contacts (who created it)
- `recipient_id`: FK → Contacts (nullable - who it's addressed to)
- `date_created`: Date
- `date_filed`: Date (nullable - for court filings)
- `date_received`: Date (nullable)
- `is_privileged`: Boolean (attorney-client privilege)
- `is_confidential`: Boolean
- `tags`: Array<String>
- `version`: Integer (for version control)
- `parent_document_id`: FK → Documents (nullable - for versions)
- `metadata`: JSONB
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Document Type Examples**:
- **Pleadings**: Complaint, Answer, Cross-Complaint, Motion to Dismiss, Motion for Summary Judgment
- **Discovery**: Interrogatories, Requests for Production, Deposition Transcripts, Requests for Admission
- **Correspondence**: Client Letter, Demand Letter, Settlement Offer, Opposing Counsel Communication
- **Evidence**: Photograph, Video, Audio Recording, Physical Evidence Documentation
- **Court Filings**: Court Order, Judgment, Minute Order, Trial Brief
- **Internal**: Case Memo, Strategy Document, Research Memo, Billing Statement

**Sample Volume**: 800-1000 documents
- Distributed across all projects
- Average 5-8 documents per project
- Some high-activity cases have 20-30 documents

---

### 4. Calendar Entries (Events & Deadlines)

**Purpose**: All scheduled events, court dates, deadlines, and meetings related to cases

**Core Fields**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects (nullable for non-case events)
- `event_type`: Enum (Court Hearing, Deposition, Client Meeting, Deadline, Internal Meeting, Filing Deadline, Discovery Cutoff, Trial, Mediation, Consultation)
- `title`: String
- `description`: Text
- `location`: String (Court address, office, Zoom link, etc.)
- `start_datetime`: Timestamp
- `end_datetime`: Timestamp
- `all_day`: Boolean
- `is_deadline`: Boolean
- `deadline_type`: String (nullable: "Discovery", "Filing", "Statute of Limitations", etc.)
- `attendees`: Array<UUID> (FK → Contacts)
- `organizer_id`: FK → Contacts
- `court_department`: String (for court events)
- `judge`: String (for court events)
- `status`: Enum (Scheduled, Confirmed, Completed, Cancelled, Rescheduled)
- `reminder_datetime`: Timestamp
- `is_recurring`: Boolean
- `recurrence_rule`: String (nullable - iCal format)
- `related_document_ids`: Array<UUID> (FK → Documents)
- `notes`: Text
- `tags`: Array<String>
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Event Type Distribution**:
- Court Hearings: 20%
- Depositions: 15%
- Client Meetings: 25%
- Deadlines: 20%
- Internal Meetings: 10%
- Other: 10%

**Sample Volume**: 500-700 calendar entries
- Distributed across date range (past 6 months + future 6 months)
- Realistic scheduling patterns (weekdays, business hours)
- Some cases have dense calendars (active litigation)

---

### 5. Notes & Tasks

**Purpose**: Internal communications, case notes, strategy notes, and task management

**Core Fields for Notes**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects (nullable for general notes)
- `note_type`: Enum (Case Note, Client Call, Internal Discussion, Strategy Note, Meeting Note, Research Note, Court Note)
- `title`: String
- `content`: Text (rich text/markdown)
- `author_id`: FK → Contacts
- `is_private`: Boolean (visible only to author)
- `is_pinned`: Boolean
- `tags`: Array<String>
- `related_contact_ids`: Array<UUID> (FK → Contacts)
- `related_document_ids`: Array<UUID> (FK → Documents)
- `related_calendar_ids`: Array<UUID> (FK → Calendar)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Core Fields for Tasks**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects
- `title`: String
- `description`: Text
- `task_type`: Enum (Follow-up, Research, Document Review, Client Communication, Filing, Discovery, Administrative)
- `priority`: Enum (High, Medium, Low)
- `status`: Enum (Not Started, In Progress, Completed, Blocked, Cancelled)
- `assigned_to_id`: FK → Contacts
- `created_by_id`: FK → Contacts
- `due_date`: Date
- `completed_date`: Date (nullable)
- `estimated_hours`: Decimal
- `actual_hours`: Decimal
- `tags`: Array<String>
- `related_document_ids`: Array<UUID> (FK → Documents)
- `parent_task_id`: FK → Tasks (nullable - for subtasks)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Sample Volume**:
- Notes: 600-800 notes
  - Average 4-6 notes per project
  - Dense note-taking for active cases
- Tasks: 400-600 tasks
  - Mix of open, in-progress, and completed
  - Realistic due date distribution

---

### 6. Time Entries & Billing

**Purpose**: Track attorney/staff time, expenses, and billing for cases

**Core Fields for Time Entries**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects
- `user_id`: FK → Contacts (must be internal attorney/staff)
- `entry_date`: Date
- `hours`: Decimal (0.1 hour increments, typical: 0.1 - 8.0)
- `billing_rate`: Decimal (dollars per hour)
- `amount`: Decimal (hours × billing_rate)
- `activity_type`: Enum (Research, Document Review, Client Communication, Court Appearance, Discovery, Drafting, Conference, Travel, Administrative)
- `description`: Text (task description)
- `is_billable`: Boolean
- `is_billed`: Boolean (has been invoiced)
- `invoice_id`: FK → Invoices (nullable)
- `tags`: Array<String>
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Core Fields for Expenses**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects
- `expense_type`: Enum (Court Filing Fee, Expert Fee, Travel, Copying, Postage, Service of Process, Deposition Costs, Investigation, Medical Records, Other)
- `expense_date`: Date
- `amount`: Decimal
- `description`: Text
- `vendor`: String
- `receipt_document_id`: FK → Documents (nullable)
- `is_billable`: Boolean
- `is_billed`: Boolean
- `invoice_id`: FK → Invoices (nullable)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Core Fields for Invoices**:
- `id`: UUID (Primary Key)
- `project_id`: FK → Projects
- `client_id`: FK → Contacts
- `invoice_number`: String
- `invoice_date`: Date
- `due_date`: Date
- `period_start`: Date
- `period_end`: Date
- `subtotal_time`: Decimal (total time charges)
- `subtotal_expenses`: Decimal (total expense charges)
- `total_amount`: Decimal
- `amount_paid`: Decimal
- `balance_due`: Decimal
- `status`: Enum (Draft, Sent, Partial Payment, Paid, Overdue, Written Off)
- `payment_terms`: String (e.g., "Net 30")
- `notes`: Text
- `sent_date`: Date (nullable)
- `paid_date`: Date (nullable)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Billing Rate Examples**:
- Senior Partner: $500-800/hour
- Partner: $400-600/hour
- Senior Associate: $300-450/hour
- Associate: $200-350/hour
- Paralegal: $100-200/hour
- Legal Assistant: $75-150/hour

**Sample Volume**:
- Time Entries: 2000-3000 entries
  - Distributed over past 12 months
  - Realistic patterns (more time on active cases)
  - Various activity types
- Expenses: 300-500 expense entries
  - Typical litigation expenses
  - Distributed across active cases
- Invoices: 150-250 invoices
  - Monthly billing cycles
  - Mix of paid, outstanding, overdue

---

### 7. Custom Fields (Case-Specific Data)

**Purpose**: Flexible fields for case-type-specific data that doesn't fit standard schema

**Implementation**: Stored in JSONB column on Projects table (`metadata` field)

**Personal Injury Fields**:
```json
{
  "injury_type": "Spinal Injury",
  "accident_date": "2024-03-15",
  "accident_type": "Motor Vehicle Accident",
  "medical_expenses": 125000.00,
  "lost_wages": 45000.00,
  "property_damage": 15000.00,
  "liability_percentage": 100,
  "insurance_policy_limit": 250000.00,
  "treatment_status": "Ongoing",
  "medical_providers": ["Dr. Smith - Orthopedics", "Dr. Johnson - Physical Therapy"],
  "injuries": ["L4-L5 herniated disc", "Chronic back pain", "Limited mobility"]
}
```

**Corporate/Transactional Fields**:
```json
{
  "transaction_type": "Merger & Acquisition",
  "contract_value": 5000000.00,
  "closing_date": "2024-12-15",
  "parties": ["Acme Corp", "Beta Industries"],
  "due_diligence_status": "In Progress",
  "regulatory_approvals": ["SEC", "FTC"],
  "financing_type": "Cash and Stock"
}
```

**Criminal Defense Fields**:
```json
{
  "charges": ["DUI", "Reckless Driving"],
  "arrest_date": "2024-06-01",
  "arraignment_date": "2024-06-15",
  "plea": "Not Guilty",
  "plea_offer": "Reduced to Reckless Driving, 6 months probation",
  "bail_amount": 25000.00,
  "bail_status": "Posted",
  "prior_convictions": 0,
  "sentencing_date": null
}
```

**Family Law Fields**:
```json
{
  "case_subtype": "Divorce",
  "children_count": 2,
  "children_ages": [8, 12],
  "custody_type": "Joint Physical, Joint Legal",
  "child_support_amount": 2500.00,
  "spousal_support_amount": 3000.00,
  "marital_property_value": 850000.00,
  "separate_property_value": 150000.00,
  "retirement_accounts": 400000.00
}
```

---

## Database Schema

### Technology Recommendation: **Supabase (PostgreSQL)**

**Why Supabase**:
- Built on PostgreSQL (robust relational database)
- Excellent support for complex queries and joins
- JSONB support for flexible custom fields
- Full-text search capabilities
- Built-in authentication
- Real-time subscriptions
- RESTful API auto-generated
- Great TypeScript support
- Free tier sufficient for prototype

### Schema Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECTS (Cases)                        │
│                      *** ATOMIC UNIT ***                        │
│─────────────────────────────────────────────────────────────────│
│ • id (PK)                    • status                           │
│ • case_number                • phase                            │
│ • name                       • priority                         │
│ • case_type                  • dates (filed, opened, closed)    │
│ • lead_attorney_id (FK)      • trial_date                       │
│ • client_id (FK)             • settlement info                  │
│ • metadata (JSONB)           • timestamps                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ One Project has many:
                 ├──────────────────────────────────────────────────┐
                 │                                                  │
                 ▼                                                  ▼
       ┌──────────────────┐                              ┌──────────────────┐
       │    CONTACTS      │◄────────────────────────────►│ PROJECT_CONTACTS │
       │                  │                              │  (Junction)      │
       ├──────────────────┤                              ├──────────────────┤
       │ • id (PK)        │                              │ • project_id (FK)│
       │ • contact_type   │                              │ • contact_id (FK)│
       │ • first_name     │                              │ • role           │
       │ • last_name      │                              │ • is_primary     │
       │ • email          │                              └──────────────────┘
       │ • phone          │
       │ • firm           │
       │ • rate_hourly    │
       └────────┬─────────┘
                │
                │ Referenced by:
                ├─────────────┐
                ▼             ▼
      ┌──────────────┐  ┌──────────────┐
      │  DOCUMENTS   │  │   CALENDAR   │
      │              │  │              │
      ├──────────────┤  ├──────────────┤
      │ • project_id │  │ • project_id │
      │ • author_id  │  │ • attendees  │
      └──────────────┘  └──────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        DOCUMENTS                                 │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • document_type                     │
│ • project_id (FK)            • title                             │
│ • author_id (FK)             • content_preview                   │
│ • recipient_id (FK)          • full_content                      │
│ • file_name                  • dates                             │
│ • is_privileged              • tags                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      CALENDAR ENTRIES                            │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • event_type                        │
│ • project_id (FK)            • title                             │
│ • organizer_id (FK)          • location                          │
│ • attendees (Array<UUID>)    • start/end datetime                │
│ • is_deadline                • status                            │
│ • deadline_type              • related docs/tasks                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          NOTES                                   │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • note_type                         │
│ • project_id (FK)            • title                             │
│ • author_id (FK)             • content                           │
│ • is_private                 • related contacts/docs/calendar    │
│ • tags                       • timestamps                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          TASKS                                   │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • task_type                         │
│ • project_id (FK)            • title                             │
│ • assigned_to_id (FK)        • description                       │
│ • created_by_id (FK)         • priority                          │
│ • status                     • due_date                          │
│ • parent_task_id (FK)        • estimated/actual hours            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      TIME ENTRIES                                │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • activity_type                     │
│ • project_id (FK)            • hours                             │
│ • user_id (FK)               • billing_rate                      │
│ • entry_date                 • amount (calculated)               │
│ • description                • is_billable                       │
│ • invoice_id (FK)            • is_billed                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         EXPENSES                                 │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • expense_type                      │
│ • project_id (FK)            • amount                            │
│ • expense_date               • description                       │
│ • vendor                     • is_billable                       │
│ • invoice_id (FK)            • receipt_document_id (FK)          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        INVOICES                                  │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                    • invoice_number                    │
│ • project_id (FK)            • invoice_date                      │
│ • client_id (FK)             • due_date                          │
│ • period (start/end)         • amounts (subtotals, total, paid)  │
│ • status                     • balance_due                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationships

### Relationship Summary

| Parent Entity | Child Entity | Relationship Type | Description |
|---------------|--------------|-------------------|-------------|
| Projects | Contacts | Many-to-Many | Projects have multiple contacts in different roles |
| Projects | Documents | One-to-Many | Each document belongs to one project |
| Projects | Calendar | One-to-Many | Each calendar entry belongs to one project |
| Projects | Notes | One-to-Many | Each note belongs to one project |
| Projects | Tasks | One-to-Many | Each task belongs to one project |
| Projects | Time Entries | One-to-Many | Each time entry belongs to one project |
| Projects | Expenses | One-to-Many | Each expense belongs to one project |
| Projects | Invoices | One-to-Many | Each invoice belongs to one project |
| Contacts | Documents | One-to-Many (Author) | Each document has one author |
| Contacts | Calendar | Many-to-Many (Attendees) | Calendar entries have multiple attendees |
| Contacts | Notes | One-to-Many (Author) | Each note has one author |
| Contacts | Tasks | One-to-Many (Assigned) | Each task assigned to one person |
| Contacts | Time Entries | One-to-Many (User) | Each time entry by one person |
| Invoices | Time Entries | One-to-Many | Invoice contains multiple time entries |
| Invoices | Expenses | One-to-Many | Invoice contains multiple expenses |
| Documents | Documents | One-to-Many (Versions) | Documents can have versions |
| Tasks | Tasks | One-to-Many (Subtasks) | Tasks can have subtasks |

### Foreign Key Constraints

All foreign keys should have proper constraints:
- `ON DELETE CASCADE` for required relationships (e.g., Project deleted → Documents deleted)
- `ON DELETE SET NULL` for optional relationships (e.g., Contact deleted → Document author_id set to NULL)
- Indexes on all foreign key columns for query performance

---

## Sample Data Specifications

### Data Volume Summary

| Entity | Target Volume | Notes |
|--------|---------------|-------|
| Projects | 150-200 | Mix of case types and statuses |
| Contacts | 300-400 | Includes internal staff, clients, opposing parties |
| Documents | 800-1000 | Realistic distribution across projects |
| Calendar Entries | 500-700 | Past 6 months + future 6 months |
| Notes | 600-800 | Higher volume for active cases |
| Tasks | 400-600 | Mix of open and completed |
| Time Entries | 2000-3000 | Past 12 months of billable time |
| Expenses | 300-500 | Typical litigation expenses |
| Invoices | 150-250 | Monthly billing cycles |

### Data Distribution Guidelines

**Projects by Case Type**:
- Personal Injury: 40% (60-80 cases)
- Corporate/Business: 20% (30-40 cases)
- Family Law: 15% (22-30 cases)
- Criminal Defense: 10% (15-20 cases)
- Employment: 8% (12-16 cases)
- Real Estate: 7% (10-15 cases)

**Projects by Status**:
- Active: 35%
- Discovery: 20%
- Pre-Trial: 15%
- Settled: 15%
- Trial: 5%
- Closed: 10%

**Projects by Priority**:
- High: 20%
- Medium: 50%
- Low: 30%

**Documents by Type**:
- Pleadings: 15%
- Discovery: 25%
- Correspondence: 20%
- Evidence: 15%
- Court Filings: 10%
- Internal Memos: 10%
- Other: 5%

**Calendar Entries by Type**:
- Court Hearings: 20%
- Depositions: 15%
- Client Meetings: 25%
- Deadlines: 20%
- Internal Meetings: 10%
- Other: 10%

**Time Entries by Activity**:
- Document Review: 25%
- Research: 20%
- Client Communication: 15%
- Drafting: 15%
- Court Appearance: 10%
- Discovery: 10%
- Other: 5%

---

## Data Generation Strategy

### Phase 1: Core Entities (Week 1)

**Step 1.1: Generate Contacts First** (2-3 hours)
- Create internal attorneys (15-20)
- Create internal staff (10-15)
- Create clients (150-200)
- Create opposing counsel (50-75)
- Create witnesses and experts (50-80)

**Why First**: Contacts are referenced by all other entities

**Tools**:
- @faker-js/faker for realistic names, emails, addresses
- Custom California-focused data (LA, SF, SD courts and locations)
- Realistic law firm names
- Proper California bar numbers

**Step 1.2: Generate Projects** (3-4 hours)
- Create 150-200 projects
- Assign lead attorneys (FK → Contacts)
- Assign clients (FK → Contacts)
- Assign opposing counsel where applicable
- Populate custom fields based on case type
- Generate realistic case numbers
- Set realistic date ranges (filed dates, trial dates, etc.)

**Step 1.3: Create Project-Contact Relationships** (1 hour)
- Populate project_contacts junction table
- Assign roles: Primary Client, Co-Counsel, Witness, Expert, etc.
- Create realistic team structures (3-5 people per active case)

### Phase 2: Content Entities (Week 1-2)

**Step 2.1: Generate Documents** (4-6 hours)
- Create 800-1000 documents
- Distribute across projects (realistic patterns)
- Generate mock content (2-5 paragraphs per document)
- Use templates for common document types
- Create proper file names and paths
- Set author_id from appropriate contacts
- Some documents have versions (parent_document_id)

**Document Content Templates**:
```
Complaint Template:
"This complaint is filed by [Client Name] against [Defendant Name] for [Cause of Action].
Plaintiff alleges that on [Date], [Description of Events]. As a result of Defendant's
actions, Plaintiff suffered [Damages]. Plaintiff seeks compensatory damages, costs,
and attorney's fees. WHEREFORE, Plaintiff requests judgment..."

Deposition Transcript Template:
"DEPOSITION OF [Witness Name], taken on [Date] at [Location]. Present: [Attorneys].
Q: Please state your full name for the record. A: [Name]. Q: [Question about case facts].
A: [Answer]. [Continue with relevant Q&A]..."

Client Letter Template:
"Dear [Client Name], This letter is to update you on the status of your case, [Case Name].
We have recently [Action Taken]. The next steps include [Next Steps]. Please contact us
if you have any questions..."
```

**Step 2.2: Generate Calendar Entries** (3-4 hours)
- Create 500-700 calendar entries
- Realistic date distribution (past 6 months, future 6 months)
- Business days only for most entries
- Business hours (8am-6pm) for most events
- Some all-day events (deadlines)
- Proper attendee lists from project contacts
- Link to related documents where applicable

**Step 2.3: Generate Notes & Tasks** (3-4 hours)
- Create 600-800 notes
  - Realistic content (strategy, client calls, case updates)
  - Various note types
  - Proper author attribution
- Create 400-600 tasks
  - Realistic task descriptions
  - Mix of statuses (20% completed, 40% in-progress, 40% not started)
  - Proper due date distribution
  - Assigned to relevant team members

### Phase 3: Billing Entities (Week 2)

**Step 3.1: Generate Time Entries** (4-6 hours)
- Create 2000-3000 time entries
- Past 12 months
- Realistic patterns:
  - More time on active cases
  - Senior attorneys bill more hours
  - 6-minute increments (0.1 hour units)
  - Activity types match case work
  - Descriptive task descriptions

**Time Entry Description Examples**:
```
"Review and respond to discovery requests from opposing counsel"
"Telephone conference with client regarding settlement offer"
"Research case law on statute of limitations for personal injury claims"
"Draft motion to compel responses to interrogatories"
"Prepare for and attend deposition of plaintiff"
"Review medical records and prepare summary for expert witness"
```

**Step 3.2: Generate Expenses** (2-3 hours)
- Create 300-500 expense entries
- Common litigation expenses:
  - Court filing fees ($400-500)
  - Deposition costs ($500-2000)
  - Expert witness fees ($2000-10000)
  - Service of process ($50-150)
  - Copying costs ($20-200)
  - Travel expenses ($100-500)

**Step 3.3: Generate Invoices** (3-4 hours)
- Create 150-250 invoices
- Monthly billing cycles
- Link time entries and expenses to invoices
- Calculate totals correctly
- Realistic payment patterns:
  - 60% paid within 30 days
  - 25% partial payment or late
  - 10% overdue
  - 5% written off

### Phase 4: Data Validation & Refinement (Week 2)

**Step 4.1: Validate Relationships** (2-3 hours)
- Ensure all foreign keys are valid
- Verify project_contacts relationships
- Check document author_ids exist
- Validate calendar attendee arrays

**Step 4.2: Add Cross-References** (2-3 hours)
- Link related documents in notes
- Add document references to calendar entries
- Create task dependencies

**Step 4.3: Realistic Data Patterns** (2-3 hours)
- Ensure high-priority cases have more activity
- Active cases have recent time entries
- Closed cases have completion dates
- Invoice amounts match time/expenses

**Step 4.4: Generate Search Indexes** (1-2 hours)
- Create full-text search indexes on:
  - Document content
  - Note content
  - Project names and descriptions
  - Contact names

---

## Query Patterns

### Common Query Examples

These queries demonstrate the richness of the data and how entities connect:

#### 1. Find all active personal injury cases with trial dates in the next 90 days
```sql
SELECT p.*, c.first_name, c.last_name
FROM projects p
JOIN contacts c ON p.client_id = c.id
WHERE p.case_type = 'Personal Injury'
  AND p.status = 'Active'
  AND p.trial_date BETWEEN NOW() AND NOW() + INTERVAL '90 days'
ORDER BY p.trial_date ASC;
```

#### 2. Get all documents filed in discovery phase for a specific case
```sql
SELECT d.*
FROM documents d
JOIN projects p ON d.project_id = p.id
WHERE p.id = 'project-uuid'
  AND d.document_type = 'Discovery'
  AND d.date_created BETWEEN p.date_opened AND COALESCE(p.date_closed, NOW())
ORDER BY d.date_created DESC;
```

#### 3. Calculate total billable time by attorney for current month
```sql
SELECT
  c.first_name || ' ' || c.last_name AS attorney_name,
  SUM(te.hours) AS total_hours,
  SUM(te.amount) AS total_amount,
  COUNT(DISTINCT te.project_id) AS case_count
FROM time_entries te
JOIN contacts c ON te.user_id = c.id
WHERE te.entry_date >= DATE_TRUNC('month', NOW())
  AND te.entry_date < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
  AND te.is_billable = true
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_amount DESC;
```

#### 4. Find cases with medical expenses over $100k (original demo query)
```sql
SELECT
  p.id,
  p.name,
  p.case_number,
  p.metadata->>'medical_expenses' AS medical_expenses,
  c.first_name || ' ' || c.last_name AS client_name,
  a.first_name || ' ' || a.last_name AS attorney_name
FROM projects p
JOIN contacts c ON p.client_id = c.id
JOIN contacts a ON p.lead_attorney_id = a.id
WHERE p.case_type = 'Personal Injury'
  AND (p.metadata->>'medical_expenses')::numeric > 100000
ORDER BY (p.metadata->>'medical_expenses')::numeric DESC;
```

#### 5. Get upcoming deadlines for next 30 days across all cases
```sql
SELECT
  ce.title,
  ce.deadline_type,
  ce.start_datetime,
  p.name AS case_name,
  p.case_number
FROM calendar_entries ce
JOIN projects p ON ce.project_id = p.id
WHERE ce.is_deadline = true
  AND ce.start_datetime BETWEEN NOW() AND NOW() + INTERVAL '30 days'
  AND p.status != 'Closed'
ORDER BY ce.start_datetime ASC;
```

#### 6. Find all open tasks assigned to a specific attorney
```sql
SELECT
  t.*,
  p.name AS project_name,
  p.case_number
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN contacts c ON t.assigned_to_id = c.id
WHERE c.email = 'attorney@lawfirm.com'
  AND t.status IN ('Not Started', 'In Progress')
ORDER BY t.due_date ASC, t.priority DESC;
```

#### 7. Get case summary with all related counts
```sql
SELECT
  p.*,
  (SELECT COUNT(*) FROM documents WHERE project_id = p.id) AS document_count,
  (SELECT COUNT(*) FROM calendar_entries WHERE project_id = p.id) AS calendar_count,
  (SELECT COUNT(*) FROM notes WHERE project_id = p.id) AS note_count,
  (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status != 'Completed') AS open_task_count,
  (SELECT SUM(hours) FROM time_entries WHERE project_id = p.id) AS total_hours,
  (SELECT SUM(amount) FROM time_entries WHERE project_id = p.id) AS total_billed
FROM projects p
WHERE p.id = 'project-uuid';
```

#### 8. Find cases with no activity in the last 60 days
```sql
SELECT
  p.id,
  p.name,
  p.case_number,
  p.status,
  MAX(GREATEST(
    COALESCE((SELECT MAX(created_at) FROM documents WHERE project_id = p.id), '1900-01-01'),
    COALESCE((SELECT MAX(created_at) FROM calendar_entries WHERE project_id = p.id), '1900-01-01'),
    COALESCE((SELECT MAX(created_at) FROM notes WHERE project_id = p.id), '1900-01-01'),
    COALESCE((SELECT MAX(entry_date) FROM time_entries WHERE project_id = p.id), '1900-01-01')
  )) AS last_activity_date
FROM projects p
WHERE p.status IN ('Active', 'Discovery', 'Pre-Trial')
GROUP BY p.id
HAVING MAX(GREATEST(
    COALESCE((SELECT MAX(created_at) FROM documents WHERE project_id = p.id), '1900-01-01'),
    COALESCE((SELECT MAX(created_at) FROM calendar_entries WHERE project_id = p.id), '1900-01-01'),
    COALESCE((SELECT MAX(created_at) FROM notes WHERE project_id = p.id), '1900-01-01'),
    COALESCE((SELECT MAX(entry_date) FROM time_entries WHERE project_id = p.id), '1900-01-01')
  )) < NOW() - INTERVAL '60 days'
ORDER BY last_activity_date DESC;
```

#### 9. Full-text search across documents and notes
```sql
SELECT
  'document' AS type,
  d.id,
  d.title,
  d.content_preview AS content,
  p.name AS project_name,
  d.created_at
FROM documents d
JOIN projects p ON d.project_id = p.id
WHERE to_tsvector('english', d.full_content || ' ' || d.title) @@ to_tsquery('english', 'settlement & agreement')
UNION ALL
SELECT
  'note' AS type,
  n.id,
  n.title,
  LEFT(n.content, 200) AS content,
  p.name AS project_name,
  n.created_at
FROM notes n
JOIN projects p ON n.project_id = p.id
WHERE to_tsvector('english', n.content || ' ' || n.title) @@ to_tsquery('english', 'settlement & agreement')
ORDER BY created_at DESC
LIMIT 20;
```

#### 10. Get attorney workload summary
```sql
SELECT
  c.first_name || ' ' || c.last_name AS attorney_name,
  COUNT(DISTINCT p.id) AS active_cases,
  COUNT(DISTINCT t.id) AS open_tasks,
  COUNT(DISTINCT ce.id) AS upcoming_events,
  COALESCE(SUM(te.hours), 0) AS month_hours
FROM contacts c
LEFT JOIN projects p ON p.lead_attorney_id = c.id AND p.status IN ('Active', 'Discovery', 'Pre-Trial')
LEFT JOIN tasks t ON t.assigned_to_id = c.id AND t.status IN ('Not Started', 'In Progress')
LEFT JOIN calendar_entries ce ON ce.organizer_id = c.id AND ce.start_datetime BETWEEN NOW() AND NOW() + INTERVAL '7 days'
LEFT JOIN time_entries te ON te.user_id = c.id
  AND te.entry_date >= DATE_TRUNC('month', NOW())
  AND te.entry_date < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
WHERE c.contact_type = 'Internal Attorney'
GROUP BY c.id, c.first_name, c.last_name
ORDER BY active_cases DESC, month_hours DESC;
```

---

## Implementation Plan

### Week 1: Setup & Core Data

**Day 1-2: Database Setup** (8-10 hours)
- [ ] Create Supabase project
- [ ] Design and create all table schemas
- [ ] Set up foreign key relationships
- [ ] Add indexes for performance
- [ ] Create ENUM types
- [ ] Set up full-text search indexes
- [ ] Configure Row Level Security (RLS) policies

**Day 3-4: Generate Core Entities** (10-12 hours)
- [ ] Write data generation scripts (TypeScript)
- [ ] Generate Contacts (300-400)
- [ ] Generate Projects (150-200)
- [ ] Populate project_contacts junction table
- [ ] Validate relationships and foreign keys
- [ ] Seed database with core data

**Day 5: Content Entities Part 1** (6-8 hours)
- [ ] Generate Documents (800-1000)
  - Create document templates
  - Generate realistic content
  - Link to authors and projects
- [ ] Generate Calendar Entries (500-700)
  - Realistic date distributions
  - Proper attendee lists

### Week 2: Content & Billing Data

**Day 6: Content Entities Part 2** (6-8 hours)
- [ ] Generate Notes (600-800)
  - Various note types
  - Realistic content
- [ ] Generate Tasks (400-600)
  - Task descriptions
  - Proper assignments and due dates

**Day 7-8: Billing Data** (10-12 hours)
- [ ] Generate Time Entries (2000-3000)
  - Realistic activity descriptions
  - Proper hour increments
  - Correct billing rates
- [ ] Generate Expenses (300-500)
  - Common litigation expense types
- [ ] Generate Invoices (150-250)
  - Link time entries and expenses
  - Calculate totals
  - Realistic payment statuses

**Day 9: Data Validation** (4-6 hours)
- [ ] Run validation queries
- [ ] Check data integrity
- [ ] Verify all relationships
- [ ] Test common query patterns
- [ ] Add missing cross-references
- [ ] Fix any data issues

**Day 10: API Integration** (6-8 hours)
- [ ] Set up Supabase client in SvelteKit
- [ ] Create API service layer
- [ ] Implement search endpoints
- [ ] Test queries from frontend
- [ ] Add caching layer (optional)
- [ ] Document API patterns

### Week 3: Query Implementation & Testing

**Day 11-12: Chat Integration** (10-12 hours)
- [ ] Update chat interface to use real data
- [ ] Implement query parsing for common patterns
- [ ] Replace demo mode with database queries
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all query flows

**Day 13: Advanced Queries** (4-6 hours)
- [ ] Implement complex multi-table queries
- [ ] Add full-text search
- [ ] Optimize slow queries
- [ ] Add query result caching
- [ ] Test query performance

**Day 14: Testing & Documentation** (6-8 hours)
- [ ] Comprehensive testing of all queries
- [ ] Performance benchmarking
- [ ] Document query patterns
- [ ] Create example queries
- [ ] Write data maintenance guide

---

## Data Generation Script Structure

### File Organization

```
LOIS/
└── data/
    ├── generators/
    │   ├── 01-contacts.ts           # Generate contacts first
    │   ├── 02-projects.ts            # Generate projects
    │   ├── 03-project-contacts.ts    # Link projects to contacts
    │   ├── 04-documents.ts           # Generate documents
    │   ├── 05-calendar.ts            # Generate calendar entries
    │   ├── 06-notes.ts               # Generate notes
    │   ├── 07-tasks.ts               # Generate tasks
    │   ├── 08-time-entries.ts        # Generate time entries
    │   ├── 09-expenses.ts            # Generate expenses
    │   ├── 10-invoices.ts            # Generate invoices
    │   └── utils/
    │       ├── faker-config.ts       # Faker.js configuration
    │       ├── legal-templates.ts    # Document/note templates
    │       ├── case-types.ts         # Case type definitions
    │       └── billing-rates.ts      # Attorney billing rates
    ├── seed-database.ts              # Main seeding script
    └── validate-data.ts              # Validation script
```

### Example Generator (contacts.ts)

```typescript
import { faker } from '@faker-js/faker';
import { supabase } from '../lib/supabaseClient';

const ATTORNEY_FIRST_NAMES = ['Michael', 'Sarah', 'David', 'Jennifer', 'Robert', ...];
const ATTORNEY_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', ...];
const LAW_FIRMS = ['Morgan & Associates', 'Smith Law Group', 'Johnson Legal', ...];

export async function generateContacts() {
  const contacts = [];

  // Generate internal attorneys
  for (let i = 0; i < 20; i++) {
    contacts.push({
      contact_type: 'Internal Attorney',
      entity_type: 'Person',
      first_name: faker.helpers.arrayElement(ATTORNEY_FIRST_NAMES),
      last_name: faker.helpers.arrayElement(ATTORNEY_LAST_NAMES),
      email: faker.internet.email(),
      phone_primary: faker.phone.number(),
      firm: 'Your Law Firm',
      title: faker.helpers.arrayElement(['Partner', 'Senior Associate', 'Associate']),
      bar_number: `CA${faker.number.int({ min: 100000, max: 999999 })}`,
      rate_hourly: faker.helpers.arrayElement([250, 300, 350, 400, 500, 600]),
      is_active: true
    });
  }

  // Generate clients
  for (let i = 0; i < 180; i++) {
    contacts.push({
      contact_type: 'Client',
      entity_type: 'Person',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone_primary: faker.phone.number(),
      address_line1: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento']),
      state: 'CA',
      zip: faker.location.zipCode(),
      is_active: true
    });
  }

  // Insert into Supabase
  const { data, error } = await supabase
    .from('contacts')
    .insert(contacts)
    .select();

  if (error) throw error;

  console.log(`✅ Generated ${data.length} contacts`);
  return data;
}
```

---

## Query Examples for Chat Interface

### Natural Language Query → SQL Mapping

| User Query | Generated SQL Pattern |
|------------|----------------------|
| "Show me all personal injury cases in discovery" | `WHERE case_type = 'Personal Injury' AND phase = 'Discovery'` |
| "Which cases have trial dates this month?" | `WHERE trial_date BETWEEN start_of_month AND end_of_month` |
| "Find cases where medical expenses exceed $100k" | `WHERE (metadata->>'medical_expenses')::numeric > 100000` |
| "Show me open tasks for John Smith" | `JOIN contacts WHERE name = 'John Smith' AND status IN ('Not Started', 'In Progress')` |
| "What documents were filed last week?" | `WHERE document_type IN ('Court Filing', 'Pleading') AND date_filed > NOW() - INTERVAL '7 days'` |
| "How much time did we bill on the Jones case?" | `SELECT SUM(hours) WHERE project_id = jones_id AND is_billable = true` |
| "Which cases haven't been billed this month?" | Complex query joining invoices and checking null or old dates |
| "Show me all depositions scheduled for next month" | `WHERE event_type = 'Deposition' AND start_datetime BETWEEN next_month_start AND next_month_end` |

---

## Success Criteria

### Data Quality Metrics

- [ ] All foreign keys are valid (0 orphaned records)
- [ ] At least 150 projects created
- [ ] At least 300 contacts created
- [ ] Project-contact relationships average 4-6 contacts per project
- [ ] Documents distributed realistically (active cases have more documents)
- [ ] Calendar entries span past 6 months and future 6 months
- [ ] Time entries total to realistic billable hours (1500-2000 hours per attorney per year)
- [ ] Invoice amounts accurately reflect time entries and expenses
- [ ] Custom fields populated appropriately for case types
- [ ] All queries from "Query Patterns" section execute successfully
- [ ] Full-text search returns relevant results
- [ ] Query performance < 500ms for typical queries

### Data Realism Checks

- [ ] Attorney billing rates are realistic ($200-800/hour)
- [ ] Case numbers follow proper format (CV-YYYY-NNNNNN)
- [ ] California-specific courts and locations
- [ ] Realistic date sequences (filed < trial, opened < closed, etc.)
- [ ] Document content is coherent and relevant to case type
- [ ] Time entry descriptions are realistic and varied
- [ ] Expense amounts match typical litigation costs
- [ ] Task due dates are reasonable (not all overdue, not all far future)
- [ ] Note content is professional and case-relevant
- [ ] Calendar entries don't conflict (same person, same time)

---

## Next Steps After Data Store is Complete

1. **Update Chat Interface** to query real data instead of hardcoded responses
2. **Implement Query Parser** to convert natural language to SQL
3. **Add Filters** for refining search results
4. **Create Result Views** for different entity types
5. **Add Data Export** functionality
6. **Implement Routine Execution** against real data
7. **Build Analytics Dashboard** using the rich dataset

---

## Appendix A: SQL Schema Creation Script

See separate file: `database/schema.sql`

---

## Appendix B: Sample Data Templates

See separate file: `data/templates/`

---

**Document Version**: 1.0
**Status**: Ready for Implementation
**Estimated Implementation Time**: 3 weeks (80-100 hours)
**Next Action**: Set up Supabase project and create database schema
