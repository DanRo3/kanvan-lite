
# Kanban Lite: User Stories & MVP Requirements

This document breaks down the essential features of the Kanban Lite MVP into specific User Stories. These stories are written from the perspective of the end-user and describe a piece of functionality, its value, and the acceptance criteria that must be met for the story to be considered "done."

---

## 🎯 Core Epics

For clarity, we can group our user stories into three main epics for the MVP:

1.  **Epic 1: User & Session Management** - Covers authentication, roles, and user identity.
2.  **Epic 2: Project Lifecycle Management** - Covers the creation and administration of projects by Owners.
3.  **Epic 3: Public Project Visibility** - Covers the client-facing, read-only experience.

---

## Epic 1: User & Session Management

### US-1: User Sign-Up & Sign-In

-   **As a:** Project Owner or Developer
-   **I want to:** Sign up and log in to the application using my Google or GitHub account.
-   **So that:** I can access my dashboard and manage my projects or tasks securely without needing to create a new password.

**Acceptance Criteria:**
-   [ ] The login page presents options for "Sign in with Google" and "Sign in with GitHub."
-   [ ] Upon successful authentication with a provider, a new `User` record is created in the database if one doesn't already exist.
-   [ ] The user's role defaults to `DEVELOPER` upon first sign-up.
-   [ ] After logging in, the user is redirected to their main dashboard.
-   [ ] The user's session is managed securely, and a "Log Out" button is available.

### US-2: User Role Assignment (Manual for MVP)

-   **As a:** System Administrator (initially, via direct database access)
-   **I want to:** Be able to change a user's role from `DEVELOPER` to `OWNER`.
-   **So that:** I can grant project creation privileges to trusted users.

**Acceptance Criteria:**
-   [ ] The `User` model in the database has an `enum` field for `role` (`OWNER`, `DEVELOPER`).
-   [ ] A system administrator can manually update this field in the database (e.g., using Prisma Studio).
-   [ ] The application logic correctly respects the assigned role to grant or deny access to features.

---

## Epic 2: Project Lifecycle Management

### US-3: Project Creation

-   **As a:** Project Owner
-   **I want to:** Create a new project by providing a name, a deadline, and a total budget of "points."
-   **So that:** I can set up a new workspace for a client job and define its core constraints.

**Acceptance Criteria:**
-   [ ] An `OWNER`-role user sees a "Create New Project" button on their dashboard.
-   [ ] Clicking the button opens a form with fields for: Project Name (required), Description (optional), Deadline (required date), and Points Budget (required number).
-   [ ] Upon submission, a new `Project` record is created in the database, linked to the owner.
-   [ ] A unique, shareable `publicId` is automatically generated for the new project.
-   [ ] The project's initial status is `PLANNED`.

### US-4: Project Dashboard View

-   **As a:** Project Owner
-   **I want to:** See a list of all the projects I own on my main dashboard.
-   **So that:** I can get a quick overview of all my ongoing work.

**Acceptance Criteria:**
-   [ ] The dashboard displays a card for each project owned by the logged-in user.
-   [ ] Each card shows the project name, its current status, the progress bar (points used vs. budget), and the deadline.
-   [ ] Clicking on a project card navigates to the detailed project management view.

### US-5: Task Management

-   **As a:** Project Owner or assigned Developer
-   **I want to:** Add, view, and update tasks within a project.
-   **So that:** I can break down the work, track its progress, and keep the project status up-to-date.

**Acceptance Criteria:**
-   [ ] In the detailed project view, there is a form to add a new task with: Title (required), Points (required number), and Development Hours (optional).
-   [ ] Tasks are displayed in columns representing their status: `Pending`, `In Progress`, `Completed`, `Deployed`.
-   [ ] Users can drag and drop tasks between status columns (or use a dropdown menu) to update the status.
-   [ ] When a task is moved to `DEPLOYED`, the `pointsUsed` on the parent `Project` model is automatically increased by the task's `points` value.
-   [ ] When a task is moved out of `DEPLOYED`, the `pointsUsed` is decreased.

---

## Epic 3: Public Project Visibility

### US-6: Shareable Project Link

-   **As a:** Project Owner
-   **I want to:** Find and copy the unique, shareable link for my project.
-   **So that:** I can send it to my client to give them access to the read-only dashboard.

**Acceptance Criteria:**
-   [ ] In the detailed project view, there is a clearly visible "Share Project" button or link.
-   [ ] Clicking this copies the public URL (`/project/[publicId]`) to the clipboard.

### US-7: Read-Only Client Dashboard

-   **As a:** Client (with a shareable link)
-   **I want to:** View a clean, easy-to-understand dashboard of the project's progress.
-   **So that:** I can stay informed about the project's status at any time without needing to ask for updates.

**Acceptance Criteria:**
-   [ ] Accessing the `/project/[publicId]` URL does not require a login.
-   [ ] The page displays the project name, description, and deadline countdown.
-   [ ] A prominent progress bar shows the percentage of completion, calculated as `(pointsUsed / pointsBudget) * 100`.
-   [ ] Tasks are displayed in a simplified list or columns, showing their title and status.
-   [ ] The view is strictly read-only. No edit buttons, forms, or drag-and-drop functionalities are present.
-   [ ] Sensitive information like `developmentHours` or assigned developers is not visible on this page.
