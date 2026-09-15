# Cloudroom functionality audit

## Problems found in the uploaded project

1. **Root folders were never fetched**
   - The frontend called `GET /files` at the root and then explicitly set `children.folders` to an empty array.
   - Result: folder creation succeeded but root could never display the folder.
   - Fix: added `GET /api/folders` for root contents and switched the Files page to use it.

2. **Upload request used the wrong field**
   - Backend requires numeric `sizeBytes`.
   - Frontend sent `size`.
   - This caused every normal upload to fail with `Invalid file size`.
   - Fix: frontend now sends `sizeBytes: file.size` and validates `50 * 1024 * 1024`.

3. **Upload signed URL response was read at the wrong level**
   - Backend returns `{ upload: { signedUrl, ... } }`.
   - Frontend expected `data.signedUrl`.
   - Fix: frontend reads `data.upload.signedUrl`.

4. **Upload completion used wrong size field**
   - Backend requires `sizeBytes`.
   - Frontend sent `size`.
   - Fix applied.

5. **Download route was missing**
   - Frontend called `GET /api/files/:id/download`.
   - Backend had a controller but no route.
   - Fix: route added.

6. **Download response field was wrong**
   - Backend returns `downloadUrl`.
   - Frontend looked for `url` / `signedUrl`.
   - Fix applied.

7. **File size was displayed from the wrong property**
   - Backend returns `size_bytes`.
   - Several frontend screens used `size`.
   - Fix applied.

8. **Search response shape did not match**
   - Backend returns one `results` array with `resource_type`.
   - Frontend expected separate `folders` and `files`.
   - Fix: frontend splits `results` into the two sections.

9. **Starred endpoint did not return names**
   - Frontend expected item names and a database `id`.
   - Backend returned only resource identifiers.
   - Fix: starred query now joins the underlying files/folders and frontend uses `resource_type:resource_id` as the stable key.

10. **Shared page was showing activity, not shared resources**
    - Fix: added `GET /api/shares/shared-with-me` and connected the page to it.

11. **Shared folder browsing was owner-only**
    - A user who received a folder share could not open that folder.
    - Fix: folder viewing now uses permission checks and supports inherited folder shares.

12. **Shared file downloads were owner-only**
    - Fix: download now checks `canView`, so direct/inherited shared access works.

13. **Inherited search permissions were incomplete**
    - Search checked only a file's immediate folder for folder shares.
    - Fix: ancestor traversal now recognizes inherited shares.

14. **Most item actions were not wired to the actual UI**
    - `ItemMenu` existed but `Files.jsx` only opened rename.
    - Fix: item menus now wire rename, move, delete, download, star, share, and public-link actions.

15. **Share management was incomplete**
    - Fix: share modal now lists current recipients and supports revoke.

16. **Public-link management was incomplete**
    - Fix: link modal now lists active links and supports copy/revoke.

17. **Google OAuth redirected to a nonexistent frontend route**
    - Backend redirected to `/dashboard`, while the React router uses `/`.
    - Fix: callback redirects to the frontend root.

18. **Expired access tokens logged the user out unnecessarily**
    - Frontend had no refresh/retry interceptor.
    - Fix: Axios now refreshes the access token once after a 401 and retries the original request.

19. **The frontend contained unused Next.js starter files**
    - The actual app is Vite/React, but the project also contained Next starter files and `.next`.
    - Fix: the cleaned project removes those unused Next files.

## Validation

- Backend TypeScript check: **passes** (`tsc --noEmit`).
- Frontend build could not be executed in this Linux inspection environment because the uploaded `node_modules` contains Windows-native optional binaries. This is an environment/package-install issue, not a source error. Run a fresh `npm install` on Windows before `npm run build`.

## Important security issue

The uploaded archive contained a real `.env` file. Do **not** commit or redistribute that file. If its secrets were exposed outside your machine, rotate the database, JWT, Supabase service-role, and Google OAuth credentials.
