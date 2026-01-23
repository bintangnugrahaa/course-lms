## Course LMS – Fullstack Learning Management System

A fullstack Learning Management System (LMS) for course managers and students, built with a React + Vite frontend and a Node.js/Express backend using MongoDB.  
Managers can create and manage courses, upload content (video/text), enroll students, and view overview metrics; students can sign in to access their enrolled courses and consume course content. The system integrates with Midtrans for subscription/payment verification.

---

### 1. High-Level Architecture Overview

- **Frontend (SPA)**:  
  - React 18 app bootstrapped with Vite, using React Router loaders and React Query–style data fetching via custom services.
  - Communicates with the backend via REST APIs over HTTP using Axios.
  - Manages authenticated sessions in secure local storage and injects JWT into API calls via Axios interceptors.

- **Backend (API Server)**:  
  - Node.js + Express application exposing REST endpoints under `/api`.
  - Uses MongoDB via Mongoose for persistence.
  - Uses JWT-based authentication, Zod-based validation, and Multer for file uploads (thumbnails, student avatars).
  - Integrates with **Midtrans** for payment handling and account verification.

- **Database**:  
  - MongoDB with collections for `User`, `Course`, `CourseDetail`, `Category`, and `Transaction`.
  - Relations modeled through Mongoose refs (e.g., courses reference categories, students reference courses).

- **Interaction**:
  - Frontend calls a configured base API URL (`VITE_API_URL`) through Axios.
  - Public endpoints: sign up, sign in, payment callback.  
  - Protected endpoints: course management, student management, overview, and student course access guarded with `verifyToken` middleware.

---

### 2. Tech Stack

#### 2.1 Frontend

- **Core**:
  - React 18
  - React Router DOM v6 loaders (`createBrowserRouter`)
  - Vite 5 (React SWC plugin)
- **State & Data**:
  - `react-query` (v3) for data fetching/caching in some areas
  - Custom services using Axios instances
- **Forms & Validation**:
  - `react-hook-form`
  - `zod` + `@hookform/resolvers`
- **UI & Styling**:
  - Tailwind CSS 3
  - `@tailwindcss/typography`
- **Other**:
  - `axios`
  - `react-secure-storage` for persisting auth sessions
  - CKEditor 5 (`ckeditor5`, `@ckeditor/ckeditor5-react`, `ckeditor-tailwind-reset`)

#### 2.2 Backend

- **Core**:
  - Node.js (ES modules)
  - Express 4
- **Database & ORM**:
  - MongoDB
  - Mongoose 8
- **Auth & Security**:
  - `jsonwebtoken` for JWT
  - `bcrypt` for password hashing
  - `cors`
- **Validation & Parsing**:
  - `zod`
  - `body-parser`
  - `dotenv`
- **File Handling**:
  - `multer` for multipart file uploads (course thumbnails, student photos)
- **Dev Tooling**:
  - `nodemon` for dev server reload

---

### 3. Folder Structure Explanation

#### 3.1 Backend (`/backend`)

- `package.json` – Backend dependencies and scripts.
- `bun.lock` – Bun lockfile (project uses Bun-compatible tooling; can still run with Node).
- `.gitignore`
- `public/`
  - `uploads/`
    - `courses/` – Stored course thumbnail images.
    - `students/` – Stored student avatar images.
- `src/`
  - `index.js` – Express app entrypoint; wires middleware, routes, and DB connection.
  - `controllers/`
    - `authController.js` – Sign up (with Midtrans transaction creation) and sign in.
    - `courseController.js` – CRUD and content management for courses, student-course linking.
    - `studentController.js` – CRUD for students and student-course listing.
    - `overviewController.js` – Aggregated metrics (totals, lists) for dashboards.
    - `paymentController.js` – Midtrans payment webhook/notification handler.
    - `globalController.js` – Simple health/hello endpoint.
  - `middlewares/`
    - `verifyToken.js` – JWT verification and user injection into `req.user`.
    - `validateRequest.js` – Zod-based request body validator.
  - `models/`
    - `userModel.js` – User schema (manager/student, courses, manager ref).
    - `courseModel.js` – Course schema (name, thumbnail, category, description, details, students, manager) plus cleanup hook.
    - `courseDetailModel.js` – Course content items (video/text, youtubeId/text, timestamps) + cleanup hook.
    - `categoryModel.js` – Course categories and back-reference to courses.
    - `transactionModel.js` – Midtrans transactions with status.
    - `overviewRoutes.js` – (Misnamed) Express router for `/overviews` endpoint.
  - `routes/`
    - `authRoutes.js` – `/sign-up`, `/sign-in` with validation.
    - `courseRoutes.js` – `/courses`, `/categories`, `/courses/contents`, `/courses/students`.
    - `studentRoutes.js` – `/students`, `/students-courses`.
    - `globalRoutes.js` – `/hello-world`, `/test-validate`.
    - `paymentRoutes.js` – `/handle-payment-midtrans`.
  - `utils/`
    - `database.js` – MongoDB connection (uses `DATABASE_URL` env var).
    - `multer.js` – Multer storage configs and file filter.
    - `schema.js` – Zod schemas for auth, courses, content, students, and student-course assignment.

#### 3.2 Frontend (`/frontend`)

- `package.json` – Frontend dependencies and scripts.
- `bun.lock`
- `index.html` – Vite entry HTML.
- `vite.config.js` – Vite + React SWC plugin config.
- `tailwind.config.js` – Tailwind content paths and typography plugin.
- `postcss.config.js`, `eslint.config.js`, `.gitignore`
- `public/`
  - `assets/` – Static images, icons, logos, backgrounds, thumbnails.
- `src/`
  - `main.jsx` – React root entry, router provider.
  - `App.jsx` – App shell (if used).
  - `index.css` – Global styles + Tailwind layers.
  - `components/`
    - `layout.jsx` – Dashboard layout wrapper (sidebar, header, etc.).
    - `header.jsx`, `navbar.jsx`, `sidebar.jsx` – Shared layout/UI components.
  - `router/`
    - `index.jsx` – `createBrowserRouter` configuration with manager and student route trees, loaders, and session guards.
  - `services/`
    - `authService.js` – `postSignUp`, `postSignIn` hitting `/sign-up` and `/sign-in`.
    - `courseService.js` – Course and content APIs (CRUD, category list, student-course mapping).
    - `studentService.js` – Student CRUD + student-course listing.
    - `overviewService.js` – `/overviews` dashboard data.
  - `utils/`
    - `axios.js` – Axios base instances, auth interceptor, and JWT injection.
    - `const.js` – Storage key constants (`STORAGE_KEY`, `MANAGER_SESSION`, `STUDENT_SESSION`).
    - `zodSchema.js` – Frontend-side Zod schemas for forms (auth, course, content, student).
  - `pages/`
    - `SignIn/`, `SignUp/`, `SuccessCheckout/`
    - `manager/`
      - `home/` – Overview dashboard (courses, students, metrics).
      - `courses/` – Manager course list.
      - `create-courses/` – Create/edit course form with thumbnail upload.
      - `course-detail/` – Per-course content and metadata view.
      - `course-content-create/` – Create/edit content (video/text) per course.
      - `course-preview/` – Preview course content (manager/student).
      - `students/` – Student list for managers.
      - `students-create/` – Student creation/update form.
      - `student-course/` – Manage students enrolled in a course.
    - `student/StudentOverview/` – Student’s course overview page.

---

### 4. System Flow / How Frontend Talks to Backend

#### 4.1 Base Communication

- Frontend configures Axios with:

```js
const baseURL = import.meta.env.VITE_API_URL;
```

- All requests are sent to `baseURL` using:
  - `apiInstance` – for public requests (sign in/sign up).
  - `apiInstanceAuth` – for authenticated requests (courses, students, overview, student course access).

#### 4.2 Authentication & Session

1. **Sign Up (Manager)**  
   - Frontend: `authService.postSignUp(data)` → `POST /sign-up`.  
   - Backend:
     - Hashes password with bcrypt.
     - Creates `User` with role `manager` and default photo.
     - Creates `Transaction` with fixed price.
     - Sends payment request to Midtrans using `MIDTRANS_URL` & `MIDTRANS_AUTH_STRING`.
     - Returns `midtrans_payment_url` for redirect to payment page (`/success-checkout` route in frontend).

2. **Sign In (Manager/Student)**  
   - Frontend: `authService.postSignIn(data)` → `POST /sign-in`.  
   - Backend:
     - Looks up user by email.
     - Verifies password with bcrypt.
     - For non-student roles, checks a corresponding `Transaction` with `status: 'success'`; otherwise returns “User not verified”.
     - Signs a JWT with `SECRET_KEY_JWT` and includes id, name, email, role in response.
   - Frontend:
     - Stores `{ token, role, ... }` into `react-secure-storage` under `STORAGE_KEY`.
     - Next requests use `apiInstanceAuth` with header `Authorization: JWT <token>`.

3. **JWT Middleware**  
   - `verifyToken` in backend:
     - Expects header `Authorization: "JWT <token>"`.
     - Verifies token with `SECRET_KEY_JWT`.
     - Loads user by ID and attaches a sanitized `req.user` with `_id`, `name`, `email`, `role`.
     - Returns `400` if token invalid/expired → frontend interceptor redirects to `/manager/sign-in` and clears storage.

#### 4.3 Route Guards in Frontend

- Frontend `router/index.jsx` uses `createBrowserRouter` with `loader` functions:
  - Manager routes (`/manager`) require session with `role === 'manager'`.
  - Student routes (`/student`) require session with `role === 'student'`.
  - Sign-in / sign-up routes redirect away if a valid session already exists.

#### 4.4 Core Business Flows

- **Course Management (Manager)**:
  - Fetch list: `GET /courses` (requires JWT) → shows cards with `thumbnail_url`, `category`, `total_students`.
  - Create: manager uploads thumbnail via multipart to `POST /courses`; backend:
    - Validates body with `mutateCourseSchema`.
    - Validates `categoryId` exists.
    - Creates course, updates `Category.courses` and manager’s `User.courses`.
  - Update: `PUT /courses/:id` with optional thumbnail; retains old thumbnail if not provided.
  - Delete: `DELETE /courses/:id`; backend:
    - Deletes course, removes thumbnail file and cross-refs through Mongoose `post('findOneAndDelete')` hook.

- **Course Content (Manager)**:
  - CRUD via `/courses/contents` endpoints:
    - `POST /courses/contents` – Create text/video content per course.
    - `PUT /courses/contents/:id` – Update content.
    - `GET /courses/contents/:id` – Get content detail.
    - `DELETE /courses/contents/:id` – Delete content and unlink from course via `courseDetailModel` hooks.
  - Preview usage uses `?preview=true` query to include `text`/`youtubeId`.

- **Student Management (Manager)**:
  - `GET /students` – List students under manager with `photo_url`.
  - `POST /students` – Create student user with uploaded avatar, hashed password, and role `"student"`.
  - `PUT /students/:id` – Update student; password optional.
  - `DELETE /students/:id` – Delete student, remove enrollment from courses, delete avatar file.

- **Student Enrolment to Courses (Manager)**:
  - `GET /courses/students/:id` – View students assigned to a course.
  - `POST /courses/students/:id` – Add a student to course (updates both `User.courses` and `Course.students`).
  - `PUT /courses/students/:id` – Remove student from course (pull inverse relations).

- **Overview Dashboard (Manager)**:
  - `GET /overviews` – Returns:
    - `totalCourses`
    - `totalStudents`
    - `totalVideos`
    - `totalTexts`
    - `courses` list with `thumbnail_url` and `total_students`
    - `students` list with `photo_url`
  - Frontend uses this to populate manager dashboard.

- **Student Portal**:
  - `GET /students-courses` – For authenticated `req.user` (student), returns list of enrolled courses with `thumbnail_url`.  
  - `/student` routes in frontend use this data to render student view.  
  - Detailed course view uses `/courses/:id?preview=true`.

- **Payment Handling via Midtrans**:
  - `POST /handle-payment-midtrans`:
    - Reads `transaction_status` and `order_id` from webhook.
    - Updates `Transaction` status to `success` or `failed`.
    - Successful payments are later checked during sign in to mark user as verified.

---

### 5. Environment Variables (.env Explanation)

Backend reads environment via `dotenv`:

- **Required (inferred from code):**
  - `DATABASE_URL` – MongoDB connection string (e.g., `mongodb://localhost:27017/course-lms`).
  - `SECRET_KEY_JWT` – Secret key for JWT signing/verification.
  - `MIDTRANS_URL` – Midtrans charge/transaction endpoint.
  - `MIDTRANS_AUTH_STRING` – Base64-encoded Midtrans API credentials (used in `Authorization: Basic ...` header).
  - `APP_URL` – Base URL used to generate public image URLs, e.g., `http://localhost:3000`.

Frontend uses Vite env variables:

- **Required:**
  - `VITE_API_URL` – Base URL for API calls (should include `/api` prefix or not, depending on how you host).  
    - In local dev with default backend port and prefix: likely `http://localhost:3000/api`.

> **Note**: No `.env` files are committed in this repo. The exact values and deployment-time configuration are left to the integrator.

---

### 6. Installation Guide

#### 6.1 Prerequisites

- Node.js 18+ (or Bun, if desired, but Node is implied by scripts).
- npm/pnpm/yarn (choose one).
- MongoDB instance (local or remote).
- Midtrans account and API credentials (for full payment flow; app still runs without but sign-up may fail).

#### 6.2 Clone the Repository

```bash
git clone https://github.com/bintangnugrahaa/course-lms.git
cd course-lms
```

#### 6.3 Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `backend/`:

```bash
DATABASE_URL=mongodb://localhost:27017/course-lms
SECRET_KEY_JWT=your-strong-secret
MIDTRANS_URL=https://api.sandbox.midtrans.com/v2/charge
MIDTRANS_AUTH_STRING=base64-encoded-midtrans-credentials
APP_URL=http://localhost:3000
```

#### 6.4 Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` in `frontend/`:

```bash
VITE_API_URL=http://localhost:3000/api
```

---

### 7. How to Run Backend

From the `backend/` folder:

```bash
npm run dev
```

- This runs `nodemon src/index.js`.
- Default port: **3000**.
- Static files are served from `public/` (e.g., `public/uploads/courses`), and API routes are served under `/api`.

Verify server is running:

- `GET http://localhost:3000/` → `{ "text": "Hello World" }`.
- `GET http://localhost:3000/api/hello-world` → `{ "message": "Hello World" }`.

---

### 8. How to Run Frontend

From the `frontend/` folder:

```bash
npm run dev
```

- This runs Vite dev server (default at `http://localhost:5173`).

Ensure `VITE_API_URL` points to your backend, for example:

```bash
VITE_API_URL=http://localhost:3000/api
```

Open the app in your browser:

```text
http://localhost:5173
```

---

### 9. Build & Production Deployment Guide

#### 9.1 Frontend Build

From `frontend/`:

```bash
npm run build
```

- Produces optimized static assets under `frontend/dist/`.

Deploy options:

- **Option A**: Serve `frontend/dist` via a static host (e.g., Nginx/S3/CloudFront/Netlify/Vercel) and configure it to proxy API requests to the backend (`/api`).
- **Option B**: Integrate built frontend into a server (e.g., serve `dist` from Express or a separate Nginx).

Preview locally:

```bash
npm run preview
```

#### 9.2 Backend Production

- Use a process manager like PM2, systemd, or containerize with Docker.
- Ensure environment variables are set on the host:
  - `DATABASE_URL`, `SECRET_KEY_JWT`, `APP_URL`, `MIDTRANS_URL`, `MIDTRANS_AUTH_STRING`.
- Start the app with Node:

```bash
cd backend
node src/index.js
```

#### 9.3 Static File Hosting

- Backend already serves static files from `public/`:

```js
app.use(express.static('public'));
```

- Course thumbnails and student photos are referenced using `APP_URL + '/uploads/courses/'` and `APP_URL + '/uploads/students/'`.  
  Ensure `APP_URL` matches your deployed backend’s public URL.

---

### 10. API Documentation Summary

Below is a summary inferred directly from backend route definitions and controllers. All **protected** routes require header:

```http
Authorization: JWT <token>
```

#### 10.1 Global

| Method | Path                 | Auth | Description                          |
|--------|----------------------|------|--------------------------------------|
| GET    | `/api/hello-world`   | No   | Simple hello-world test endpoint.    |
| POST   | `/api/test-validate` | No   | Test Zod validation with `exampleSchema` (body `{ name: string }`). |

#### 10.2 Authentication

| Method | Path        | Auth | Body                                   | Description                                                  |
|--------|-------------|------|----------------------------------------|--------------------------------------------------------------|
| POST   | `/api/sign-up` | No   | `{ name, email, password }`           | Creates manager user, creates Midtrans transaction, returns `midtrans_payment_url`. |
| POST   | `/api/sign-in` | No   | `{ email, password }`                 | Authenticates user, verifies transaction (for managers), returns `{ name, email, token, role }`. |

#### 10.3 Courses

All below require JWT via `verifyToken`.

| Method | Path                        | Auth | Description |
|--------|-----------------------------|------|-------------|
| GET    | `/api/courses`             | Yes  | List courses for the logged-in manager (name, category, students, thumbnail_url, total_students). |
| GET    | `/api/categories`          | Yes  | List all categories. |
| GET    | `/api/courses/:id`         | Yes  | Get course detail with category and details. `?preview=true` adds `text` and `youtubeId` fields in details. |
| POST   | `/api/courses`             | Yes  | Create course with multipart-form thumbnail, body validated by `mutateCourseSchema`. |
| PUT    | `/api/courses/:id`         | Yes  | Update course; optionally new thumbnail. |
| DELETE | `/api/courses/:id`         | Yes  | Delete course and associated details, unlinking from categories and students. |

**Course Content Endpoints**

| Method | Path                              | Auth | Description |
|--------|------------------------------------|------|-------------|
| POST   | `/api/courses/contents`          | Yes  | Create content item (`title`, `type`, `courseId`, `text`, `youtubeId`) validated by `mutateContentSchema`. |
| PUT    | `/api/courses/contents/:id`      | Yes  | Update content item. |
| GET    | `/api/courses/contents/:id`      | Yes  | Get content detail. |
| DELETE | `/api/courses/contents/:id`      | Yes  | Delete content and remove from course. |

**Course-Student Mapping**

| Method | Path                               | Auth | Description |
|--------|-------------------------------------|------|-------------|
| GET    | `/api/courses/students/:id`        | Yes  | Get course with populated students and each `photo_url`. |
| POST   | `/api/courses/students/:id`        | Yes  | Add a student to course (`body: { studentId }` validated by `addStudentCourseSchema`). |
| PUT    | `/api/courses/students/:id`        | Yes  | Remove student from course (`body: { studentId }`). |

#### 10.4 Students (Manager Context)

| Method | Path                  | Auth | Description |
|--------|-----------------------|------|-------------|
| GET    | `/api/students`       | Yes  | List students for manager with `photo_url`. |
| GET    | `/api/students/:id`   | Yes  | Get detail for a single student (`name`, `email`). |
| POST   | `/api/students`       | Yes  | Create student with avatar (multipart form), validated by `mutateStudentSchema`. |
| PUT    | `/api/students/:id`   | Yes  | Update student, password optional, avatar optional. |
| DELETE | `/api/students/:id`   | Yes  | Delete student, unlink from courses, delete avatar file. |

#### 10.5 Student Courses (Student Context)

| Method | Path                       | Auth | Description |
|--------|----------------------------|------|-------------|
| GET    | `/api/students-courses`    | Yes  | For logged-in student user, returns list of enrolled courses with `thumbnail_url`. |

#### 10.6 Overview

| Method | Path               | Auth | Description |
|--------|--------------------|------|-------------|
| GET    | `/api/overviews`   | Yes  | Returns aggregated dashboard statistics & lists for manager. |

#### 10.7 Payment Webhook / Notification

| Method | Path                              | Auth | Description |
|--------|-----------------------------------|------|-------------|
| POST   | `/api/handle-payment-midtrans`    | No   | Midtrans webhook; updates `Transaction.status` based on `transaction_status` and `order_id`. |

---

### 11. Database & Migration Info

- **Database**: MongoDB.
- **Model relationships**:
  - `User`
    - `role: 'manager' | 'student'`
    - `courses: [ObjectId<Course>]`
    - `manager: ObjectId<User>` (for students referencing their manager).
  - `Course`
    - `category: ObjectId<Category>`
    - `students: [ObjectId<User>]`
    - `manager: ObjectId<User>`
    - `details: [ObjectId<CourseDetail>]`
  - `CourseDetail`
    - `course: ObjectId<Course>`
    - `type: 'video' | 'text'`
    - `youtubeId`, `text`
  - `Category`
    - `courses: [ObjectId<Course>]`
  - `Transaction`
    - `user: ObjectId<User>`
    - `price: number`
    - `status: 'pending' | 'success' | 'failed'`

- **Lifecycle hooks (cleanup)**:
  - `courseModel.post('findOneAndDelete')`:
    - Removes course from its `Category.courses` array.
    - Deletes associated `CourseDetail` entries.
    - Pulls course from each enrolled `User.courses`.
  - `courseDetailModel.post('findOneAndDelete')`:
    - Pulls detail from `Course.details` array.

- **Migrations**:  
  No explicit migration tooling is included (e.g., no Mongoose migration scripts). Schema evolution must be handled manually (e.g., via custom scripts or mongoose migration packages added later).

---

### 12. Scripts & Commands

#### Backend (`backend/package.json`)

| Script | Command               | Description                           |
|--------|-----------------------|---------------------------------------|
| `dev`  | `nodemon src/index.js` | Start backend API with nodemon.      |
| `test` | `echo "Error: no test specified" && exit 1` | Placeholder test script. |

#### Frontend (`frontend/package.json`)

| Script   | Command                                                          | Description                               |
|----------|------------------------------------------------------------------|-------------------------------------------|
| `dev`    | `vite`                                                           | Start Vite dev server.                    |
| `build`  | `vite build`                                                     | Build production bundle.                  |
| `preview`| `vite preview`                                                   | Preview production build locally.         |
| `lint`   | `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0` | Run ESLint over JS/JSX sources. |

---

### 13. Development Guidelines (Inferred)

- **Coding Style**:
  - ES modules used on both backend and frontend.
  - Backend uses async/await and standard Express handler signatures.
  - Validation is centralized with Zod (`schema.js` in backend and `zodSchema.js` in frontend).
  - Controllers focus on business logic, routes are thin (Express Router per domain).

- **Validation**:
  - Backend:
    - `validateRequest(schema)` middleware for auth and some course/student endpoints.
    - Additional manual `safeParse` usage for more detailed error responses and cleanup (e.g., deleting files if validation fails).
  - Frontend:
    - `zodSchema.js` ensures forms mirror backend expectations (e.g., `createCourseSchema`, `mutateContentSchema`, `createStudentSchema`).

- **Error Handling**:
  - Backend consistently catches errors and returns `500` with `"Internal server error"` and logs to console.
  - Some validation returns `500` for invalid input; in a stricter API this might be better as `400`.

- **Security**:
  - Passwords hashed with `bcrypt` (12 salt rounds).
  - JWTs signed with `SECRET_KEY_JWT` and `expiresIn: '1 days'`.
  - Auth header convention is `"JWT <token>"`.
  - React-secure-storage used to store session in frontend.

- **File Uploads**:
  - Multer storage configured for:
    - `public/uploads/courses` via `fileStorageCourse`.
    - `public/uploads/students` via `fileStorage('students')`.
  - Accepts only JPEG/PNG MIME types.

- **Front-End UX Patterns**:
  - Uses React Router loaders for data fetching at route level.
  - Uses `redirect` helpers to enforce route-level auth.
  - Manager & student dashboards share layout but differ by `isAdmin` flag.

---

### 14. Troubleshooting

| Problem | Possible Cause | Things to Check |
|--------|----------------|-----------------|
| Frontend cannot reach backend (`Network Error` in browser console) | `VITE_API_URL` misconfigured or backend not running | Ensure `VITE_API_URL` matches backend URL, e.g., `http://localhost:3000/api`, and backend is running. |
| All protected API calls are returning 400 `"Unauthorization"` | Missing or invalid JWT header | Check that sign-in succeeded, `STORAGE_KEY` exists in secure storage, and `apiInstanceAuth` is being used for protected requests. |
| Users stuck on sign in with `"User not verified"` | Midtrans payment not marked success | Confirm Midtrans sandbox/production config and that `/api/handle-payment-midtrans` is reachable and correctly configured as callback. |
| Images not loading (`thumbnail_url` or `photo_url` broken) | Incorrect `APP_URL` or static hosting | Ensure `APP_URL` points to deployed backend and that `public/uploads/...` directories are accessible. |
| MongoDB connection errors | `DATABASE_URL` missing or incorrect | Update `.env` with a valid MongoDB URI and ensure MongoDB is running. |
| 500 errors with `"Internal server error"` on create/update endpoints | Validation failing or data inconsistency | Check response body for `errors` when available; verify payload matches Zod schemas (e.g., required fields like `name`, `categoryId`, `tagline`, `description`, `studentId`). |

---

### 15. Contribution Guide

> This section is generic and not enforced by code, but recommended for collaborators.

1. **Branching**:
   - Create feature branches from `main` (e.g., `feature/xyz`, `bugfix/abc`).
2. **Code Style**:
   - Follow existing patterns in controllers, models, and services.
   - Keep routes thin; put logic in controllers or services.
   - Use Zod for validating incoming requests and form submissions.
3. **Commits**:
   - Use clear, descriptive commit messages.
4. **Testing**:
   - Add unit/integration tests if you introduce new logic (no test harness currently in repo, so you may add Jest or similar).
5. **API Changes**:
   - Update both backend controllers/routes and frontend services/router loaders in sync.
   - Extend Zod schemas on both backend (`utils/schema.js`) and frontend (`utils/zodSchema.js`) where relevant.
6. **Documentation**:
   - Update this `README.md` when:
     - Adding new endpoints.
     - Changing environment variable requirements.
     - Modifying core flows or architecture.

---

### 16. License

This project does not currently specify a license.  
Add an appropriate license (e.g., MIT, Apache 2.0, proprietary) here before open-sourcing or distributing.