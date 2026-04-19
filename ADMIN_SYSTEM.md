# BrainLoom — Per-Service Admin System

## Overview

BrainLoom uses a **scoped admin model** — each admin account is tied to a specific service (scope). An admin for the Tutorial service cannot touch the Premium service or Analytics service. A **Super Admin** sits above all of them and is the only one who can create new admins.

---

## Admin Scopes

| Scope | What they manage |
|---|---|
| `tutorial` | Topics, content blocks, MCQs, uploads, comments |
| `premium` | Premium plans, subscriptions |
| `analytics` | Analytics dashboards and data |
| `all` | Everything — Super Admin only |

> To add a new service, add its scope name to `VALID_SCOPES` in `auth-service/src/repositories/admin.repository.js`.

---

## How the System Works

```
Super Admin (scope: "all", is_super: 1)
    │
    ├── Creates Tutorial Admin  (scope: "tutorial", is_super: 0)
    ├── Creates Premium Admin   (scope: "premium",  is_super: 0)
    └── Creates Analytics Admin (scope: "analytics",is_super: 0)

Tutorial Admin → can only call Tutorial Service routes
Premium Admin  → can only call Premium Service routes
Analytics Admin→ can only call Analytics Service routes
```

### Token Flow

```
1. Admin logs in
        │
        ▼
POST /api/v1/auth/admin/login
        │
        ▼
Auth Service issues JWT with:
  { sub: "admin_<id>", scope: "tutorial", is_super: false }
        │
        ▼
Frontend stores accessToken
        │
        ▼
Admin calls protected route (e.g. create a topic)
  Authorization: Bearer <token>
        │
        ▼
API Gateway verifies token → fetches claims from Auth Service
  → attaches headers:
      x-user-id      = admin_<id>
      x-user-role    = admin
      x-user-scope   = tutorial
      x-user-super   = false
        │
        ▼
Tutorial Service receives request
  → requireAdmin middleware checks:
      role === "admin"  ✅
      scope === "tutorial" OR "all"  ✅ / ❌
        │
        ▼
Access granted or 403 Forbidden
```

---

## Database Schema

Run this migration on the **tutorial database** (where the `admins` table lives):

```sql
-- Add scope and update is_super if not already present
ALTER TABLE admins
  ADD COLUMN scope VARCHAR(50) NOT NULL DEFAULT 'tutorial',
  ADD COLUMN is_super TINYINT(1) NOT NULL DEFAULT 0;

-- Optional index for faster lookups
CREATE INDEX idx_admins_scope ON admins(scope);
```

> If your `admins` table was created without these columns, run the migration above before deploying.

---

## First-Time Setup — Creating the Super Admin

You must create the Super Admin manually using the seed script. This is a one-time operation.

### Step 1 — Set environment variables (optional)

Add to `auth-service/.env`:

```env
SUPER_ADMIN_EMAIL=superadmin@brainloom.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
```

If not set, defaults are used (`superadmin@brainloom.com` / `ChangeThisPassword123!`).

### Step 2 — Run the seed script

```bash
cd auth-service
node src/scripts/seedSuperAdmin.js
```

Output:
```
🌱 Seeding super admin...
   Email : superadmin@brainloom.com
   Scope : all
✅ Super admin created! ID: 1
```

> ⚠️ Run this **only once**. It checks for existing email before inserting.

---

## Creating a Service Admin (After Super Admin Exists)

### Step 1 — Login as Super Admin

```
POST http://localhost:4000/api/v1/auth/admin/login

{
  "email": "superadmin@brainloom.com",
  "password": "YourSecurePassword123!"
}

Response:
{
  "accessToken": "eyJ...",
  "scope": "all",
  "is_super": true
}
```

### Step 2 — Use the Super Admin token to create a service admin

```
POST http://localhost:4000/api/v1/auth/admin/register
Authorization: Bearer <superAdminToken>

{
  "name":     "Tutorial Admin",
  "email":    "tutorial@brainloom.com",
  "password": "SecurePass123!",
  "scope":    "tutorial",
  "phone":    "+91 9999999999"   // optional
}

Response:
{
  "message": "Admin registered successfully",
  "adminId": 2,
  "scope": "tutorial"
}
```

### Step 3 — Tutorial Admin logs in

```
POST http://localhost:4000/api/v1/auth/admin/login

{
  "email":    "tutorial@brainloom.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJ...",
  "scope": "tutorial",
  "is_super": false
}
```

This admin can now use the `accessToken` to call all Tutorial Service admin routes.

---

## Adding Admins for Other Services

When you implement the Premium or Analytics service, follow the same pattern:

```
// Premium admin
{ "scope": "premium",   "email": "premium@brainloom.com",   ... }

// Analytics admin
{ "scope": "analytics", "email": "analytics@brainloom.com", ... }
```

In those services, import `requireScope` from `roleMiddleware` and use it on protected routes:

```js
import { requireScope } from "../middleware/roleMiddleware.js";

router.post("/plans", requireScope("premium"), controller.createPlan);
```

---

## Middleware Reference

### `requireAdmin` (Tutorial Service)
Allows any admin whose scope is `"tutorial"` or `"all"`.

```js
import { requireAdmin } from "../middleware/roleMiddleware.js";
router.post("/topics/add", requireAdmin, controller.create);
```

### `requireSuperAdmin` (Tutorial Service)
Only allows `is_super === true` admins.

```js
import { requireSuperAdmin } from "../middleware/roleMiddleware.js";
router.get("/admin/all-admins", requireSuperAdmin, controller.list);
```

### `requireScope(scope)` (any service)
Factory — checks for a specific named scope.

```js
import { requireScope } from "../middleware/roleMiddleware.js";
router.delete("/plan/:id", requireScope("premium"), controller.deletePlan);
```

### `requireSuperAdmin` (Auth Service)
Protects the `/admin/register` route in the auth service itself. Only a super admin can create new admins.

```js
// Already wired in auth-service/src/routes/admin.routes.js
router.post("/register", requireSuperAdmin, controller.register);
```

---

| File | Change |
|---|---|
| `auth-service/src/utils/token.util.js` | Added `generateAdminToken()` — embeds `scope` + `is_super` in JWT |
| `auth-service/src/repositories/admin.repository.js` | All queries use `auth_db`; added `scope`, `updatePassword`, `deleteAdmin`, `listAdmins` |
| `auth-service/src/services/admin.service.js` | Full rewrite — register, login, forgotPassword, resetPassword, listAdmins, deleteAdmin, forceResetPassword |
| `auth-service/src/controllers/admin.controller.js` | All new endpoints wired |
| `auth-service/src/routes/admin.routes.js` | `/register`, `/list`, `/:id`, `/:id/reset-password` protected with `requireSuperAdmin` |
| `auth-service/src/middlewares/requireSuperAdmin.js` | **NEW** — verifies super admin from JWT |
| `auth-service/src/controllers/internal.controller.js` | Returns `scope` in admin claims |
| `auth-service/src/scripts/seedSuperAdmin.js` | **NEW** — one-time super admin seed script |
| `auth-service/src/services/email.service.js` | Added `sendPasswordResetOTP` |
| `api-gateway/src/middlewares/auth.middleware.js` | Forwards `x-user-scope` and `x-user-super` headers |
| `api-gateway/src/proxies/topics.proxy.js` | Passes `x-user-scope` and `x-user-super` to tutorial service |
| `tutorial-service/src/middleware/gatewayUser.js` | Attaches `scope` and `is_super` to `req.user` |
| `tutorial-service/src/middleware/roleMiddleware.js` | `requireAdmin` checks scope; added `requireSuperAdmin`, `requireScope` |
| **Frontend** | |
| `brainloom-frontend/features/auth/auth.types.ts` | Extended `User` type with `scope`, `is_super`, `premium` |
| `brainloom-frontend/features/auth/auth.service.ts` | Added all new API methods: forgotPassword, resetPassword, listAdmins, createAdmin, deleteAdmin, forceResetPassword |
| `brainloom-frontend/hooks/useAuth.ts` | Added `isSuper`, `scope`, `login` alias |
| `brainloom-frontend/app/auth/layout.tsx` | **NEW** — auth pages have no Navbar |
| `brainloom-frontend/app/auth/login/page.tsx` | Premium dark login with forgot password link |
| `brainloom-frontend/app/auth/forgot-password/page.tsx` | **NEW** — two-step OTP password reset |
| `brainloom-frontend/app/auth/admin-login/page.tsx` | Redirects to `/auth/login` |
| `brainloom-frontend/app/admin/layout.tsx` | **NEW** — admin pages have no Navbar |
| `brainloom-frontend/app/admin/page.tsx` | Redirects to `/admin/dashboard` |
| `brainloom-frontend/app/admin/dashboard/page.tsx` | **NEW** — premium super admin dashboard |
| `brainloom-frontend/app/admin/admins/page.tsx` | **NEW** — manage admins: list, create, delete, force-reset |
| `brainloom-frontend/components/layout/Navbar.tsx` | Uses `isLoggedIn`, `isAdmin`; logout wired correctly |

---

## ⚠️ Important: Database Migration Required

Before deploying, run the migration SQL above to add `scope` and `is_super` columns to the `admins` table. Without this, the seed script and admin registration will fail.
