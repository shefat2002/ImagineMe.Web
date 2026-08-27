# Development Environment Credentials

When connecting to the `FrontendDev` environment (`https://dev-api.imaginemebylovie.com`), the backend database runs completely in-memory and comes pre-seeded with dummy accounts for testing.

## Pre-Seeded Accounts

| Role   | Identifier (Email/Username) | Password |
| :---   | :--- | :--- |
| **Admin**  | `admin@dev.local` | *(Use Magic Login)* |
| **Parent** | `parent@dev.local` | *(Use Magic Login)* |
| **Child**  | `dev_child` | *(Use Magic Login)* |

---

## 🛠 How to Log In During Development

Because the development database uses fake password hashes (`"mock_hash"`) to save startup time, standard password-based login endpoints (`/api/auth/login`) will **not work** against these accounts. 

Instead, you must use the **Magic Login** endpoint to instantly generate a valid session token for testing.

### Option 1: Using the Next.js API Client
We have added a helper method directly to `src/lib/api/auth.ts` in the web project.

```typescript
import { authService } from '@/lib/api/auth';

// Instantly generate an Admin session
const adminAuth = await authService.devMagicLogin('Admin');

// Instantly generate a Parent session
const parentAuth = await authService.devMagicLogin('Parent');

// Instantly generate a Child session
const childAuth = await authService.devMagicLogin('Child');
```

### Option 2: Using cURL or Postman
If you are testing the API directly from your terminal, you can hit the magic login endpoint like this:

```bash
# Log in as an Admin
curl -X POST https://dev-api.imaginemebylovie.com/api/dev/auth/magic-login \
  -H "Content-Type: application/json" \
  -d '{"role":"Admin"}'

# Log in as a Child
curl -X POST https://dev-api.imaginemebylovie.com/api/dev/auth/magic-login \
  -H "Content-Type: application/json" \
  -d '{"role":"Child"}'
```
