
# Kanban Lite: Developer's Guide

This document provides a technical guide for developers working on the Kanban Lite project. It details the application architecture, data flow, business logic, and API design, complementing the user stories and high-level documentation.

---

## 1. Application Flow & Component Architecture

The application is divided into three main user experiences, each with its own set of components and logic.

### 1.1. Public Experience (Unauthenticated)

-   **`/` (Homepage):** A landing page explaining the product's value proposition. Contains a call-to-action button: "Login to Get Started."
-   **`/login` (Login Page):** The page where users initiate the OAuth flow. This page will not be rendered if the user is already authenticated.
-   **`/project/public/[publicId]` (Client View):** The read-only project dashboard for the client. This page is the core of the "transparency" feature.
    -   **Data Fetching:** This page uses its `publicId` parameter to fetch project data from a dedicated, permission-free API endpoint.
    -   **Component Breakdown:**
        -   `ProjectHeader`: Displays project name and deadline countdown.
        -   `ProgressBar`: Visualizes `pointsUsed` vs. `pointsBudget`.
        -   `MetricsDisplay`: Shows high-level stats (tasks completed, days left).
        -   `TaskReadOnlyList`: A simplified list of tasks and their statuses.
        -   `Charts`: Visual breakdown of tasks by status or category.
        -   `RisksLog`: Displays any identified project risks.

### 1.2. Authenticated Experience (`OWNER` / `DEVELOPER`)

-   **`/dashboard` (Main Dashboard):** The central hub after login.
    -   **`OWNER` view:** Displays a grid of `ProjectCard` components for every project they own. Includes a "Create New Project" button.
    -   **`DEVELOPER` view:** Displays a grid of `ProjectCard` components for projects they are assigned to. The "Create" button is hidden.
-   **`/project/manage/[id]` (Project Management View):** The main workspace for managing a project.
    -   **Component Breakdown:**
        -   `ProjectHeader`: Same as client view, but with edit/management controls.
        -   `ShareButton`: Copies the public URL (`/project/public/[publicId]`) to the clipboard.
        -   `TaskBoard`: The interactive Kanban board.
            -   `TaskColumn`: Represents a status (`Pending`, `In Progress`, etc.).
            -   `TaskCard`: Represents a single task. Can be dragged between columns.
        -   `AddTaskForm`: A form to create new tasks for the project.
        -   `ProjectSettings`: A section/modal for editing project details (deadline, budget) and managing assigned developers.

---

## 2. Core Business Logic

### 2.1. Project Progress Calculation

-   The primary metric for project progress is the **percentage of points completed**.
-   **Formula:** `progressPercentage = (project.pointsUsed / project.pointsBudget) * 100`.
-   The `project.pointsUsed` value **must** be updated automatically whenever a task's status changes.
-   **Trigger:** A task's status is updated via the API.
-   **Logic:**
    -   If a task moves to the `DEPLOYED` state, its `points` value is **added** to `project.pointsUsed`.
    -   If a task moves *from* the `DEPLOYED` state to any other state, its `points` value is **subtracted** from `project.pointsUsed`.
    -   This logic should be handled within a single database transaction in the task update API endpoint to ensure data integrity.

### 2.2. Role-Based Access Control (RBAC)

RBAC must be enforced at two levels: UI rendering and API endpoints.

-   **UI Level (Client-Side):**
    -   Use the `useSession()` hook from Next-Auth to get the user's role.
    -   Conditionally render components based on the role. For example:
        ```jsx
        const { data: session } = useSession();
        
        {session?.user?.role === 'OWNER' && <CreateProjectButton />}
        ```
-   **API Level (Server-Side):**
    -   **This is the most critical security layer.** Never trust the client.
    -   Every API route that performs a mutation (CUD) or reads sensitive data must first validate the user's session and role.
    -   Create a helper function to encapsulate this logic:
        ```typescript
        // lib/auth.ts
        export async function authorize(request, requiredRole) {
          const session = await getServerSession(authOptions);
          if (!session || session.user.role !== requiredRole) {
            throw new Error('Unauthorized');
          }
          return session.user;
        }
        ```

---

## 3. API Endpoint Design (RESTful Conventions)

All API logic will be located in `app/api/`.

-   **`POST /api/projects`**
    -   **Action:** Creates a new project.
    -   **Authorization:** `OWNER` only.
    -   **Body:** `{ name, description, deadline, pointsBudget }`
    -   **Returns:** The newly created `Project` object.

-   **`GET /api/projects`**
    -   **Action:** Retrieves projects for the dashboard.
    -   **Authorization:** `OWNER` or `DEVELOPER`.
    -   **Logic:** If role is `OWNER`, returns all projects where `ownerId` matches user ID. If `DEVELOPER`, returns projects they are assigned to (requires relation in schema).
    -   **Returns:** `Project[]`

-   **`GET /api/projects/public/[publicId]`**
    -   **Action:** Retrieves a single project for the public client view.
    -   **Authorization:** None.
    -   **Logic:** Fetches the project by its `publicId`. It should only return fields that are safe for public consumption (e.g., exclude developer names, internal notes).
    -   **Returns:** A sanitized `Project` object.

-   **`POST /api/tasks`**
    -   **Action:** Creates a new task for a project.
    -   **Authorization:** `OWNER` or assigned `DEVELOPER`.
    -   **Body:** `{ title, points, projectId, developmentHours? }`
    -   **Returns:** The newly created `Task` object.

-   **`PATCH /api/tasks/[id]/status`**
    -   **Action:** Updates the status of a single task.
    -   **Authorization:** `OWNER` or assigned `DEVELOPER`.
    -   **Body:** `{ status: 'IN_PROGRESS' | 'COMPLETED' | 'DEPLOYED' }`
    -   **Logic:** This is a critical endpoint. It must perform the status update and the `project.pointsUsed` recalculation in a database transaction.
    -   **Returns:** The updated `Task` object.

---

## 4. Initial Setup & Seeding

-   After running `npx prisma db push`, the database will be empty.
-   It is recommended to create a `seed.ts` script that can be run with `npx prisma db seed`.
-   This script should:
    1.  Create a sample `OWNER` user.
    2.  Create a sample `DEVELOPER` user.
    3.  Create a sample `Project` owned by the sample owner.
    4.  Create a few sample `Tasks` within that project.
-   This will ensure that any new developer can get a fully working environment with sample data in a single command.
