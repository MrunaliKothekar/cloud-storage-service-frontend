# Cloudroom Frontend

A Tailwind CSS + React frontend for the Cloud Storage Service backend.

## Stack
- React 19
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Lucide React

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Windows PowerShell:
```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

Set:
```env
VITE_API_URL=http://localhost:5000/api
```

The Axios client uses `withCredentials: true`, so JWT/httpOnly cookies from the Express backend are sent automatically.

## Backend routes used

Auth:
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- POST `/api/auth/refresh`
- GET `/api/auth/google`

Folders:
- POST `/api/folders`
- GET `/api/folders/:id`
- PATCH `/api/folders/:id`
- DELETE `/api/folders/:id`

Files:
- GET `/api/files`
- POST `/api/files/init`
- POST `/api/files/upload-url`
- POST `/api/files/complete`
- PATCH `/api/files/:id`
- DELETE `/api/files/:id`
- GET `/api/files/:id/download`

Sharing:
- POST `/api/shares`
- GET `/api/shares`
- DELETE `/api/shares/:id`

Public links:
- POST `/api/links`
- GET `/api/links`
- GET `/api/links/public/:token`
- DELETE `/api/links/:id`

Other:
- GET `/api/search`
- POST/GET/DELETE `/api/stars`
- GET `/api/trash`
- PATCH `/api/trash/files/:id/restore`
- PATCH `/api/trash/folders/:id/restore`
- GET `/api/activities`

## Important backend CORS setting

Because the frontend is on port 3000 and backend on 5000, the backend must allow:
- origin: `http://localhost:3000`
- credentials: `true`

For production, replace the origin with your deployed frontend domain.

## Google OAuth

The login button opens the backend Google OAuth route:
`/api/auth/google`.

The backend callback must eventually redirect to the deployed frontend URL after successful authentication. Keep the Google callback URL on the backend.

## Upload flow

The upload component follows the backend's signed-upload architecture:

1. `/files/init`
2. `/files/upload-url`
3. PUT directly to Supabase signed URL
4. `/files/complete`

The browser never receives the Supabase service-role key.

## UI direction

Cloudroom uses an editorial/private-workspace visual language rather than a generic blue SaaS dashboard:
- warm paper background
- charcoal navigation
- lime action accent
- thin borders
- large serif display typography
- compact utility typography
- restrained motion
- responsive mobile navigation

## Notes

The backend's current response shape may vary slightly. API helpers intentionally accept common forms such as `response.data.user`, `response.data.files`, or direct arrays where practical.

For production, add:
- global Axios refresh/retry interceptor
- real share/link modals in item actions
- stronger upload progress using XMLHttpRequest
- pagination for large file sets
- permanent-delete UI if the backend exposes it
