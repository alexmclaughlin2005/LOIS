# Snowflake Database Schema Map - TEAM_THC2.DATABRIDGE

## Overview
This document maps out the structure and relationships of all tables in the DATABRIDGE schema. The database appears to be for a legal case management system (likely from a product called "Smokeball" or similar legal practice management software).

---

## Core Entities & Their Relationships

### 1. **Projects (Cases)** - Central Entity
**Primary Table**: `VW_DATABRIDGE_PROJECT_LIST_DATA_V1`

This is the core table representing legal cases/matters. It contains:
- `PROJECT_ID` (Primary Key)
- `PROJECT_NUMBER` - Case number
- `PROJECT_NAME` - Case name
- `PROJECT_TYPE_NAME` - Type of case
- `PHASE_NAME` - Current phase (Discovery, Trial, etc.)
- `PHASE_DATE` - When phase changed
- `CLIENT_FULL_NAME` - Primary client
- `FIRST_PRIMARY_USER_FULL_NAME` - Lead attorney
- `CREATED_AT` - Case creation date
- `CURRENT_BALANCE` - Outstanding invoice balance

**Related Tables**:
- `VW_DATABRIDGE_PROJECT_CONTACTS_DATA_V1` - People associated with the project - not only team members working on it, but parties involved in the case as well.
- `VW_DATABRIDGE_PROJECT_TEAMS_DATA_V1` - Team members working on the project
- `VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1` - Project organization/phases - the sections data contains all of the data points the people working on the project use to manage the case.
- `VW_DATABRIDGE_PROJECT_TAGS_DATA_V1` - Tags for categorization
- `VW_DATABRIDGE_PROJECT_CALENDAR_V1` - Calendar events and deadlines

---

### 2. **People (Contacts)**
**Primary Table**: `VW_DATABRIDGE_PERSON_STANDARD_DATA_V1`

Central table for all people (clients, attorneys, contacts, etc.)
- `PERSON_ID` (Primary Key)
- `FIRST_NAME`, `LAST_NAME`, `MIDDLE_NAME`
- `FULL_NAME`, `FULL_NAME_EXTENDED`
- `BIRTH_DATE`, `DEATH_DATE`, `IS_DECEASED`
- `FROM_COMPANY` - Company affiliation
- `JOB_TITLE`, `DEPARTMENT`
- `IS_INDIVIDUAL_NOT_ORGANIZATION` - Person vs organization flag
- `IS_ARCHIVED` - Archive status

**Person Detail Tables** (all linked by `PERSON_ID`):
- `VW_DATABRIDGE_PERSON_ADDRESSES_DATA_V1` - Physical addresses
- `VW_DATABRIDGE_PERSON_EMAILS_DATA_V1` - Email addresses
- `VW_DATABRIDGE_PERSON_PHONES_DATA_V1` - Phone numbers (with SMS/fax capabilities)
- `VW_DATABRIDGE_PERSON_CUSTOM_DATA_V1` - Custom fields (flexible key-value storage)
- `VW_DATABRIDGE_PERSON_TAGS_DATA_V1` - Person categorization tags
- `VW_DATABRIDGE_PERSON_TYPES_DATA_V1` - Person roles (client, attorney, witness, etc.)

---

### 3. **Billing & Finances**
**Primary Tables**:
- `VW_DATABRIDGE_INVOICE_DATA_V1` - Invoices
- `VW_DATABRIDGE_BILLING_TRANSACTION_DATA_V1` - Payments and transactions

**Invoice Structure**:
- `ID` / `INVOICE_NUMBER` - Invoice identifiers
- `PROJECT_ID` - Links to case
- `TOTAL` - Total invoice amount
- `OUTSTANDING_BALANCE` - Amount still owed
- `INVOICE_DATE`, `DUE_DATE`, `SENT_DATE`
- `FINALIZED_DATE`, `VOIDED_DATE`
- Status dates for invoice lifecycle

**Transaction Structure**:
- `ID` - Transaction ID
- `INVOICE_ID` - Links to invoice
- `PROJECT_ID` - Links to case
- `TOTAL` - Transaction amount
- `TRANSACTION_TYPE` - Payment, refund, etc.
- `AMOUNT_APPLIED_TO_INVOICE` - How much applied
- `DATE_APPLIED` - When payment applied
- `IS_VOID`, `IS_WRITE_OFF` - Transaction status

**Billing Contacts**:
- `VW_DATABRIDGE_BILLING_CONTACT_DATA_V1`
  - Links `PERSON_ID` to `PROJECT_ID`
  - `RECEIVE_BILLING_EMAILS` flag

---

### 4. **Communications & Notes**
**Primary Tables**:
- `VW_DATABRIDGE_NOTES_DATA_V1` - Notes, tasks, and communications
- `VW_DATABRIDGE_COMMENTS_DATA_V1` - Comments on notes

**Notes Structure**:
- `ID` / `NOTE_ID` - Note identifier
- `PROJECT_ID` - Links to case
- `AUTHOR_ID`, `AUTHOR_TYPE` - Who created it
- `ASSIGNEE_ID`, `ASSIGNER_ID` - Task assignment
- `COMPLETER_ID`, `COMPLETED_DATE` - Task completion
- `TYPE_TAG` - Note type
- `SOURCE`, `DESTINATION` - Communication channels
- `SUBJECT`, `BODY` - Content
- `IS_PHONE_CALL`, `PHONE_CALL_START_TIME`, `PHONE_CALL_END_TIME`
- `TARGET_DATE` - Due date
- `DELIVERY_STATUS` - Email delivery status
- `IS_ACKNOWLEDGED`, `IS_UNREAD` - Read status

**Comments Structure**:
- `ID` - Comment ID
- `NOTE_ID` - Links to parent note
- `AUTHOR_ID`, `AUTHOR_TYPE` - Who commented
- `BODY` - Comment text
- `DELIVERY_STATUS` - Email delivery status

**Tags**:
- `VW_DATABRIDGE_NOTE_TAGS_DATA_V1` - Tags applied to notes/comments

---

### 5. **Documents**
**Primary Table**: `VW_DATABRIDGE_DOCS_V1`

Document metadata and file references:
- `DOC_ID` - Document identifier
- `PROJECT_ID` - Links to case
- `FILE_NAME`, `UPLOADED_FILE_NAME` - File names
- `DOCABLE_TYPE` - What the document is attached to
- `UPLOADER_ID`, `UPLOADER_TYPE`, `UPLOADED_BY` - Who uploaded
- `IS_READ_ONLY`, `IS_PROTECTED` - Access permissions

---

### 6. **User & Team Management**
**Primary Table**: `VW_DATABRIDGE_USERS_V1`

System users (attorneys, staff, etc.):
- `USER_ID` - User identifier
- User details (names, email, role information)

**Project Teams**:
- `VW_DATABRIDGE_PROJECT_TEAMS_DATA_V1`
  - Links users to projects
  - Team member assignments

**Project Contacts**:
- `VW_DATABRIDGE_PROJECT_CONTACTS_DATA_V1`
  - Links people to projects
  - Contact roles within a case

---

### 7. **Metadata & Configuration**
**Supporting Tables**:
- `VW_DATABRIDGE_TAGS_DATA_V1` - Master tags list
- `VW_DATABRIDGE_DATA_DICTIONARY_V1` - Schema documentation
- `VW_CLIENT_AUDIT_DATA_V1` - Audit trail for user actions
- `VW_DATABRIDGE_CLIENT_INFO_V1` - Tenant/client configuration

---

## Key Relationship Patterns

### The "ORG" Pattern - for our application we are going to use these as groupings, we will create a system where we can isolve which org ID/Org_Name we are working with
Almost every table includes:
- `TENANT_ID` - Multi-tenant identifier
- `ORG_ID` - Organization identifier
- `ORG_NAME` - Organization name

This indicates a multi-tenant SaaS architecture where data is partitioned by organization.

### Common Foreign Keys

**PROJECT_ID** appears in:
- Billing Contact (links clients to cases)
- Billing Transactions
- Invoices
- Notes
- Comments (indirectly through NOTE_ID)
- Documents
- Project Contacts
- Project Teams
- Project Calendar
- Project Sections
- Project Tags

**PERSON_ID** appears in:
- Person Addresses
- Person Emails
- Person Phones
- Person Custom Data
- Person Tags
- Person Types
- Project Contacts (links people to cases)
- Billing Contact (billing recipients)

**USER_ID** appears in:
- Notes (AUTHOR_ID, ASSIGNEE_ID, COMPLETER_ID)
- Comments (AUTHOR_ID)
- Documents (UPLOADER_ID)
- Invoices (CREATED_BY_USER_ID, LAST_UPDATED_BY_USER_ID)
- Transactions (CREATED_BY_USER_ID, MODIFIED_BY_USER_ID)
- Audit Trail

**INVOICE_ID** appears in:
- Billing Transactions (links payments to invoices)

**NOTE_ID** appears in:
- Comments (parent note)
- Note Tags

---

## Entity Relationship Diagram (Conceptual)

```
┌─────────────────────┐
│   ORGANIZATION      │
│   (ORG_ID)          │
└──────────┬──────────┘
           │
           │ has many
           │
    ┌──────┴──────────────────────────────────────┐
    │                                              │
    ▼                                              ▼
┌──────────────┐                          ┌──────────────┐
│   PROJECTS   │──────── has many ────────│    PEOPLE    │
│ (PROJECT_ID) │                          │  (PERSON_ID) │
└──────┬───────┘                          └──────┬───────┘
       │                                         │
       │ has many                                │ has many
       │                                         │
    ┌──┴────────────────┐              ┌────────┴────────────┐
    ▼                   ▼              ▼                     ▼
┌──────────┐      ┌──────────┐   ┌─────────┐         ┌─────────┐
│ INVOICES │      │   NOTES  │   │ADDRESSES│         │ EMAILS  │
└────┬─────┘      └────┬─────┘   └─────────┘         └─────────┘
     │                 │
     │                 │ has many
     │                 ▼
     │           ┌──────────┐
     │           │ COMMENTS │
     │           └──────────┘
     │
     │ has many
     ▼
┌──────────────┐
│ TRANSACTIONS │
└──────────────┘
```

---

## Data Flow Examples

### Example 1: Complete Case View
To get all information about a case:
1. Start with `VW_DATABRIDGE_PROJECT_LIST_DATA_V1` (PROJECT_ID)
2. Join `VW_DATABRIDGE_PROJECT_CONTACTS_DATA_V1` to get associated people
3. Join `VW_DATABRIDGE_PERSON_STANDARD_DATA_V1` for person details
4. Join `VW_DATABRIDGE_INVOICE_DATA_V1` for billing
5. Join `VW_DATABRIDGE_NOTES_DATA_V1` for communications
6. Join `VW_DATABRIDGE_DOCS_V1` for documents
7. Join `VW_DATABRIDGE_PROJECT_CALENDAR_V1` for deadlines

### Example 2: Client Financial Summary
1. Start with `VW_DATABRIDGE_PERSON_STANDARD_DATA_V1` (PERSON_ID)
2. Join `VW_DATABRIDGE_PROJECT_CONTACTS_DATA_V1` to find their cases
3. Join `VW_DATABRIDGE_INVOICE_DATA_V1` to get invoices
4. Join `VW_DATABRIDGE_BILLING_TRANSACTION_DATA_V1` for payments
5. Calculate: SUM(INVOICE.TOTAL) - SUM(TRANSACTION.AMOUNT_APPLIED) = Outstanding Balance

### Example 3: Attorney Workload
1. Start with `VW_DATABRIDGE_USERS_V1` (USER_ID)
2. Join `VW_DATABRIDGE_PROJECT_TEAMS_DATA_V1` to find assigned cases
3. Join `VW_DATABRIDGE_PROJECT_LIST_DATA_V1` for case details
4. Join `VW_DATABRIDGE_NOTES_DATA_V1` WHERE ASSIGNEE_ID = USER_ID for tasks

---

## Questions for Subject Matter Expert

To help complete this data map, please provide insights on:

1. **Project Phase Workflow**: What are all possible values for `PHASE_NAME` and what's the typical progression? Intake - discovery - litigation - settlement - settled - archived (this is variable but should give some general idea)

2. **Person Types**: What are the different types in `VW_DATABRIDGE_PERSON_TYPES_DATA_V1`? (e.g., Client, Attorney, Witness, Expert, Opposing Counsel?) - These are fully user configureable but assume they are any type of person involved in a lawsuit.

3. **Note Types**: What values appear in `TYPE_TAG` for notes? (e.g., Task, Email, Phone Call, Meeting?) Tag Type will be for contacts, projects, docs, notes.  Then the tags themselves are fully user configurable.

4. **Project Types**: What are the common values for `PROJECT_TYPE_NAME`? (e.g., Personal Injury, Family Law, Criminal Defense?) These are any kind of lawsuit one may engage with - you have a good initial list.

5. **Transaction Types**: What transaction types exist beyond payments and refunds? Thats it for now.

6. **Custom Fields**: What are common custom fields used in `VW_DATABRIDGE_PERSON_CUSTOM_DATA_V1`? These are fully user defined so we cant give a common list.

7. **Project Sections**: How are cases typically organized in `VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1`? They usually have sections for intake, summaries, depositions, medicals, forms etc - any combination of law suit tracking.

8. **Calendar Event Types**: What event types are tracked in `VW_DATABRIDGE_PROJECT_CALENDAR_V1`?

9. **Business Rules**: Are there any important business rules or constraints we should know about? (e.g., when can an invoice be voided, who can assign tasks, etc.)

10. **Reporting Needs**: What are the most common reports or queries users need to run? Users run list of documents, list of projects, billing information etc - projects, contacts, documents and custom data fields are most common.

---

## Next Steps

With your subject matter expertise, we can:
1. ✅ Document the specific values and workflows for each field
2. ✅ Create more detailed semantic models for Cortex Analyst
3. ✅ Build pre-defined queries for common use cases
4. ✅ Design better UI visualizations based on data relationships
5. ✅ Implement data validation rules in the application
