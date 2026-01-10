# OonkoO Dashboard - Executive Overview

**Document Version:** 1.0
**Date:** January 2026
**Prepared For:** CEO & CTO
**Classification:** Internal - Strategic Planning

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current System Architecture](#current-system-architecture)
3. [Data Models & Relationships](#data-models--relationships)
4. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
5. [User Flows](#user-flows)
6. [Current Feature Matrix](#current-feature-matrix)
7. [Security Assessment](#security-assessment)
8. [Business Impact Analysis](#business-impact-analysis)
9. [Recommendations for Enhancement](#recommendations-for-enhancement)
10. [Proposed New Features](#proposed-new-features)

---

## Executive Summary

The OonkoO Dashboard is a client portal built on **Next.js 15** with **Prisma ORM** and **Kinde Authentication**. The system currently supports two user types:

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access to all clients, projects, services, leads, inquiries, and sales data |
| **User** | Access limited to their own projects and services |

### Key Statistics
- **6 Core Data Models**: User, Project, Service, Lead, ProjectInquiry, SaleInquiry
- **8 Dashboard Sections**: Dashboard Home, Projects, Services, Pricing, Clients, Sales, Inquiries, Leads
- **2 Authentication Levels**: Admin (hardcoded emails) and Regular User

### Critical Insight
The current role system is **binary** (Admin/User) with hardcoded admin emails. This limits scalability and presents opportunities for a more granular permission system.

---

## Current System Architecture

### Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│   Next.js 15 (App Router) + React 18 + Tailwind CSS            │
│   Framer Motion (Animations) + Recharts (Analytics)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Layer                         │
│              Kinde Auth (OAuth 2.0 / JWT)                       │
│         middleware.ts → protects /dashboard/* routes           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
│            Next.js API Routes (/api/*)                          │
│   Projects | Services | Clients | Leads | Inquiries | Sales    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│              Prisma ORM + PostgreSQL Database                   │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Visits /dashboard
        │
        ▼
┌───────────────────┐
│ Middleware Check  │
│ (JWT Token Valid?)│
└────────┬──────────┘
         │
    ┌────┴────┐
    │ No      │ Yes
    ▼         ▼
┌────────┐  ┌──────────────┐
│Redirect│  │/api/user     │
│to Login│  │(Upsert User) │
└────────┘  └──────┬───────┘
                   │
                   ▼
           ┌──────────────┐
           │Check isAdmin │
           │   flag       │
           └──────┬───────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│Admin Dashboard│    │User Dashboard│
│(Full Metrics)│    │(Own Data)    │
└──────────────┘    └──────────────┘
```

---

## Data Models & Relationships

### Entity Relationship Diagram

```
┌─────────────────┐       1:N       ┌─────────────────┐
│      USER       │─────────────────│     PROJECT     │
│─────────────────│                 │─────────────────│
│ id (ULID)       │                 │ id (ULID)       │
│ email (unique)  │                 │ name            │
│ firstName       │                 │ company         │
│ lastName        │                 │ email           │
│ profileImage    │                 │ planType        │
│ isAdmin         │◄────────────┐   │ features (JSON) │
│ roles (string)  │             │   │ totalPrice      │
│ createdAt       │             │   │ userId (FK)     │
│ updatedAt       │             │   │ status          │
│ lastLoginAt     │             │   └─────────────────┘
└─────────────────┘             │
        │                       │
        │ 1:N                   │
        ▼                       │
┌─────────────────┐             │
│     SERVICE     │             │
│─────────────────│             │
│ id (ULID)       │             │
│ serviceId       │─────────────┘
│ userId (FK)     │
│ userEmail       │
│ billingInterval │
│ status          │
│ startDate       │
│ endDate         │
└─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      LEAD       │    │ PROJECT_INQUIRY │    │  SALE_INQUIRY   │
│─────────────────│    │─────────────────│    │─────────────────│
│ id (ULID)       │    │ id (ULID)       │    │ id (ULID)       │
│ name            │    │ name            │    │ name            │
│ email           │    │ email           │    │ email           │
│ status          │    │ phone           │    │ phone           │
│ source          │    │ budget          │    │ saleId          │
│ createdAt       │    │ project         │    │ originalPrice   │
│ updatedAt       │    │ type            │    │ salePrice       │
└─────────────────┘    │ origin          │    │ status          │
                       │ status          │    └─────────────────┘
                       │ meetingTime     │
                       └─────────────────┘
```

### Model Purposes

| Model | Business Purpose | Records Flow |
|-------|------------------|--------------|
| **User** | Client accounts and admin users | Created on first login via Kinde |
| **Project** | Client purchased projects/plans | Created after checkout or admin creation |
| **Service** | Active subscriptions/services | Created when user selects a pricing plan |
| **Lead** | Sales prospects | Created manually by admin or from website forms |
| **ProjectInquiry** | Initial project requests | Created from website inquiry forms |
| **SaleInquiry** | Discount/sale requests | Created when users inquire about promotions |

---

## Role-Based Access Control (RBAC)

### Current Implementation

**Admin Determination (Hardcoded):**
```typescript
// lib/auth-utils.ts - Line 21
isAdmin: kindeUser.email === "imchn24@gmail.com"

// lib/admin-utils.ts - Line 4
return user?.email === "imchn24@gmail.com"

// components/dashboard/sidebar.tsx
email === "imchn24@gmail.com" || email === "fahimaniskhan@gmail.com"
```

**Issue:** Admin emails are inconsistent across files and hardcoded.

### Permission Matrix

| Dashboard Section | Admin | Regular User | Notes |
|-------------------|-------|--------------|-------|
| **Dashboard Home** | Full Analytics | Basic Stats | Admin sees revenue, leads, conversions |
| **Projects** | All Projects | Own Projects Only | User sees only their created projects |
| **Services** | All Services | Own Services Only | User sees only their subscriptions |
| **Pricing** | Full Access | Full Access | Both can view and subscribe |
| **Clients** | Full Access | Hidden | Admin-only management |
| **Leads** | Full Access | Hidden | Admin-only management |
| **Inquiries** | Full Access | Hidden | Admin-only management |
| **Sales** | Full Access | Hidden | Admin-only management |

### API Endpoint Security

| Endpoint | Auth Check | Status |
|----------|------------|--------|
| `GET /api/clients` | Admin Only | Secured |
| `POST /api/clients` | Admin Only | Secured |
| `DELETE /api/projects` | Admin Only | Secured |
| `GET /api/projects` | Role-filtered | Secured |
| `GET /api/services` | Role-filtered | Secured |
| `GET /api/leads` | None | **VULNERABLE** |
| `POST /api/leads` | None | **VULNERABLE** |
| `GET /api/project-inquiries` | None | **VULNERABLE** |
| `GET /api/sale-inquiries` | None | **VULNERABLE** |

---

## User Flows

### Admin User Journey

```
Login → Dashboard (Full Analytics)
              │
    ┌─────────┼─────────┬──────────┬──────────┐
    ▼         ▼         ▼          ▼          ▼
 Clients   Projects   Services   Leads    Inquiries
    │         │         │          │          │
    ▼         ▼         ▼          ▼          ▼
 • View All  • View All • View All • Manage  • Track
 • Add New   • Approve  • Activate  Prospects  Conversions
 • Delete    • Reject   • Cancel   • Convert  • Schedule
             • Delete              to Client   Meetings
```

### Regular User Journey

```
Login → Dashboard (Personal Stats)
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
 Projects  Services   Pricing
    │         │          │
    ▼         ▼          ▼
 • View Own • View Own • Browse Plans
 • Track    • Check    • Subscribe
   Status     Billing   (Creates Pending
              Status     Service)
```

### Lead-to-Client Conversion Flow

```
Website Visit → Project Inquiry Form
                       │
                       ▼
              ┌─────────────────┐
              │ ProjectInquiry  │
              │ status: "new"   │
              └────────┬────────┘
                       │
            Admin Reviews & Contacts
                       │
                       ▼
              ┌─────────────────┐
              │ status: "quoted"│
              └────────┬────────┘
                       │
              Client Approves Quote
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌───────────────┐            ┌───────────────┐
│ Create Project│            │ Create User   │
│ (with pricing)│            │ (send invite) │
└───────────────┘            └───────────────┘
                       │
                       ▼
              User Logs In → Sees Project
```

---

## Current Feature Matrix

### Admin Dashboard Metrics

| Metric | Data Source | Calculation |
|--------|-------------|-------------|
| Total Revenue | Projects | Sum of `totalPrice` where status = "completed" |
| Total Clients | Users | Count of all non-admin users |
| Active Projects | Projects | Count where status = "approved" or "pending" |
| Upcoming Meetings | Projects/Services | Filtered by `meetingTime > now()` |
| Lead Conversion Rate | Inquiries → Projects | Matched by email, conversion percentage |
| Conversion Time | Inquiries vs Projects | Days between inquiry and project creation |

### User Dashboard Metrics

| Metric | Data Source |
|--------|-------------|
| Total Projects | Own projects count |
| Active Projects | Own projects with active status |
| Upcoming Meetings | Own meetings scheduled |

---

## Security Assessment

### Strengths

1. **Kinde Authentication**: Industry-standard OAuth with JWT validation
2. **Middleware Protection**: All `/dashboard/*` routes require authentication
3. **Database-Level Filtering**: Users can only access their own data via API
4. **Server-Side Rendering**: Sensitive data fetched server-side

### Vulnerabilities

| Issue | Risk Level | Impact | Recommendation |
|-------|------------|--------|----------------|
| Hardcoded admin emails | **Medium** | Single point of failure for admin access | Move to database or environment variables |
| Inconsistent admin check | **Medium** | Security gaps between components | Centralize admin verification |
| Unprotected Lead/Inquiry APIs | **High** | Any authenticated user can access all leads | Add admin authorization checks |
| No rate limiting | **Medium** | Potential for abuse/scraping | Implement rate limiting middleware |
| No audit logging | **Medium** | Cannot track data modifications | Add audit trail system |

### Immediate Actions Required

1. Add `checkAdminAccess()` to:
   - `/api/leads/route.ts`
   - `/api/project-inquiries/route.ts`
   - `/api/sale-inquiries/route.ts`

2. Centralize admin email configuration in environment variables

---

## Business Impact Analysis

### Current Limitations

| Limitation | Business Impact |
|------------|-----------------|
| Binary role system (Admin/User) | Cannot delegate specific tasks to team members |
| No project collaboration | Users cannot share project access |
| No client communication portal | Clients cannot message/update through portal |
| No invoice/payment integration | Manual payment tracking required |
| No automated notifications | Manual follow-up required for status changes |
| No multi-tenant support | Cannot white-label for agency clients |

### Revenue Opportunities

| Opportunity | Potential Impact |
|-------------|------------------|
| Client portal with self-service | Reduced support overhead |
| Automated invoicing | Faster payment collection |
| Project milestone tracking | Improved client satisfaction |
| Multi-user client accounts | Enterprise client acquisition |
| API access for integrations | Developer/agency market |

---

## Recommendations for Enhancement

### Phase 1: Security & Foundation

1. **Role System Overhaul**
   - Replace `isAdmin: Boolean` with `role: Enum` (admin, manager, client, viewer)
   - Add `permissions: String[]` for granular access control
   - Store admin emails in environment variables

2. **API Security**
   - Add authorization middleware to all admin endpoints
   - Implement rate limiting
   - Add request logging/audit trail

3. **Data Model Enhancement**
   ```prisma
   model User {
     // Existing fields...
     role          Role      @default(CLIENT)
     permissions   String[]  @default([])
     teamId        String?
     team          Team?     @relation(fields: [teamId], references: [id])
   }

   enum Role {
     SUPER_ADMIN
     ADMIN
     MANAGER
     CLIENT
     VIEWER
   }
   ```

### Phase 2: Client Experience

1. **Project Communication**
   - Add comments/messages to projects
   - File attachments for deliverables
   - Status update notifications

2. **Self-Service Portal**
   - Project milestone tracking
   - Invoice viewing and payment
   - Support ticket system

3. **Notifications**
   - Email notifications for status changes
   - In-app notification center
   - Webhook integrations

### Phase 3: Business Operations

1. **Financial Integration**
   - Stripe/PayPal payment processing
   - Automated invoice generation
   - Revenue tracking dashboard

2. **Team Collaboration**
   - Multi-user client accounts
   - Role-based access per project
   - Activity timeline

3. **Analytics Enhancement**
   - Client lifetime value tracking
   - Project profitability analysis
   - Sales pipeline visualization

---

## Proposed New Features

### Feature Priority Matrix

| Feature | Effort | Business Value | Priority |
|---------|--------|----------------|----------|
| Fix API security vulnerabilities | Low | Critical | **P0** |
| Role-based permissions system | Medium | High | **P1** |
| Client messaging/comments | Medium | High | **P1** |
| Payment integration (Stripe) | Medium | Very High | **P1** |
| Email notifications | Low | Medium | **P2** |
| File uploads/deliverables | Medium | Medium | **P2** |
| Multi-user client accounts | High | High | **P2** |
| Custom branding/white-label | High | Medium | **P3** |
| API for third-party integrations | High | Medium | **P3** |

### Proposed New Data Models

```prisma
// Team/Organization support
model Team {
  id        String   @id @default(ulid())
  name      String
  members   User[]
  projects  Project[]
  createdAt DateTime @default(now())
}

// Project comments/communication
model ProjectComment {
  id        String   @id @default(ulid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  createdAt DateTime @default(now())
}

// File attachments
model Attachment {
  id        String   @id @default(ulid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  fileName  String
  fileUrl   String
  fileType  String
  uploadedBy String
  createdAt DateTime @default(now())
}

// Invoices
model Invoice {
  id          String   @id @default(ulid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  amount      Float
  status      InvoiceStatus @default(PENDING)
  dueDate     DateTime
  paidAt      DateTime?
  stripeId    String?
  createdAt   DateTime @default(now())
}

enum InvoiceStatus {
  DRAFT
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

// Notifications
model Notification {
  id        String   @id @default(ulid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String
  title     String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### Enhanced Dashboard Sections

#### For Admins (New Sections)
- **Team Management**: Manage staff, assign roles
- **Reports**: Export analytics, custom date ranges
- **Settings**: Configure notifications, integrations
- **Audit Log**: Track all system changes

#### For Clients (New Sections)
- **Messages**: Communicate with team
- **Files**: View/download deliverables
- **Invoices**: View and pay invoices
- **Support**: Submit and track tickets

---

## Summary & Next Steps

### Immediate Priorities

1. **Security First**: Fix the 4 unprotected API endpoints
2. **Centralize Admin Config**: Move hardcoded emails to environment
3. **Audit Current Users**: Verify all admin accounts

### Strategic Initiatives

1. **Q1**: Implement role-based permissions + payment integration
2. **Q2**: Launch client portal with messaging and file sharing
3. **Q3**: Add team collaboration and multi-user accounts
4. **Q4**: Build analytics dashboard and API platform

### Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Client self-service rate | 0% | 60% |
| Payment collection time | Manual | < 3 days automated |
| Support ticket response | N/A | < 24 hours |
| Client portal adoption | N/A | 80% of active clients |

---

**Document Prepared By:** Claude Code Analysis
**Review Required By:** Engineering Team Lead
**Approval Required By:** CEO & CTO

---

*This document is confidential and intended for internal strategic planning purposes only.*
