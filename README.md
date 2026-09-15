# Cloudroom Frontend

React + Vite + Tailwind CSS frontend for the Cloudroom cloud storage service.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

Frontend: `http://localhost:3000`

`.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Cloudroom
```

## Connected functionality

- Register / login / logout
- Google OAuth
- Automatic access-token refresh
- Root and nested folder navigation
- Breadcrumbs
- Folder creation, rename, move and trash
- File upload through Supabase signed upload URLs
- 50 MB client/server file-size validation
- File download through signed URLs
- File rename, move and trash
- Search
- Star / unstar
- Share with viewer/editor roles and revoke access
- Shared-with-me view
- Public links with optional password and expiration
- Trash restore
- Activity history

## Backend

The backend runs on `http://localhost:5000` by default.

Keep the backend `.env` out of Git. Use `backend/.env.example` as the template.
