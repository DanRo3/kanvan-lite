
# Kanban Lite: Project Transparency Reimagined

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-green?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-teal?logo=prisma)](https://www.prisma.io/)

**Kanban Lite** is a modern web application designed to bridge the communication gap between project owners (freelancers, agencies) and their clients. It provides a simple yet powerful interface for managing project progress and sharing it through a clean, interactive, read-only dashboard.

The core philosophy is to offer radical transparency with minimal effort. Owners can break down projects into tasks, assign effort points, and track progress, while clients get a real-time view of the project's health via a unique, shareable link, eliminating the need for constant status update meetings.

---

## 🌟 Key Features (MVP)

-   **🔐 Secure Authentication:** OAuth 2.0 integration (Google, GitHub) via Next-Auth for secure and easy sign-on.
-   **👥 Role-Based Access Control:**
    -   **Owner:** Full control over projects. Can create, edit, and assign developers.
    -   **Developer:** Can view assigned projects and update task statuses.
    -   **Client (Anonymous):** Accesses a beautiful, read-only dashboard via a private link. No login required.
-   **🏗️ Project Management:**
    -   Create projects with names, descriptions, deadlines, and a total "effort budget" in points.
    -   At-a-glance dashboard for owners to see all their projects.
-   **📋 Task Tracking:**
    -   Break down projects into individual tasks.
    -   Assign points to each task to track budget consumption.
    -   Track development time in hours (optional).
    -   Update task status through a simple, intuitive Kanban-style flow (`Pending` -> `In Progress` -> `Completed` -> `Deployed`).
-   **📊 Real-Time Client Dashboard:**
    -   A unique, unguessable URL for each project.
    -   Visual progress bars based on "points" completed vs. total budget.
    -   Countdown to the project deadline.
    -   Clean and clear task lists, showing what's done and what's next.
-   **🚀 Built for Performance:** Leverages Next.js Server Components and a robust backend architecture for a fast, responsive experience.

---

## 🛠️ Tech Stack & Architecture

This project uses a modern, type-safe, and scalable technology stack, chosen for developer experience and performance.

| Category      | Technology                                                                                             | Rationale                                                                                                 |
| :------------ | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Framework** | [**Next.js 14 (App Router)**](https://nextjs.org/)                                                     | For its hybrid rendering capabilities, Server Components, and integrated API routes (backend-for-frontend). |
| **Language**  | [**TypeScript**](https://www.typescriptlang.org/)                                                      | Ensures type safety across the entire application, reducing bugs and improving code maintainability.      |
| **Styling**   | [**Tailwind CSS**](https://tailwindcss.com/)                                                           | A utility-first CSS framework for rapid, custom UI development without leaving the HTML.                  |
| **Components**| [**Shadcn/UI**](https://ui.shadcn.com/)                                                                | A collection of beautifully designed, accessible, and unstyled components that are easy to customize.     |
| **Database**  | [**PostgreSQL**](https://www.postgresql.org/)                                                          | A powerful, open-source relational database perfect for handling the structured data of our application.  |
| **ORM**       | [**Prisma**](https://www.prisma.io/)                                                                   | A next-generation ORM that provides a type-safe database client and simplifies database migrations.       |
| **Auth**      | [**Next-Auth**](https://next-auth.js.org/)                                                             | The standard for authentication in Next.js, offering easy integration with OAuth providers and databases. |

### Architecture Overview

The application is built using the **Next.js App Router**, which allows for a clear separation of concerns.

1.  **Frontend:** UI is constructed with **React Server Components (RSCs)** wherever possible, minimizing the client-side JavaScript bundle and improving load times. Interactive elements ("client components") are used for stateful UI like forms and buttons.
2.  **Backend:** The backend logic resides in **Next.js API Routes**. These serverless functions handle all CRUD (Create, Read, Update, Delete) operations, process authentication, and enforce business logic (like role permissions).
3.  **Database Layer:** **Prisma** acts as the bridge between the API routes and the PostgreSQL database, ensuring all database queries are type-safe and efficient.

---

## 📦 Data Model

The database schema is designed to be simple but effective, capturing the core relationships between users, projects, and tasks.

<details>
<summary>Click to view the Prisma Schema</summary>

```prisma
// This schema defines the database structure for Kanban Lite.
// It includes models for users, authentication (compatible with Next-Auth),
// projects, and tasks.

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ----------------------------------------
//  AUTHENTICATION MODELS (Next-Auth)
// ----------------------------------------

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ----------------------------------------
//  APPLICATION MODELS
// ----------------------------------------

enum UserRole {
  OWNER
  DEVELOPER
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(DEVELOPER)
  accounts      Account[]
  sessions      Session[]
  projects      Project[] // Projects created by this user (if they are an OWNER)
}

enum ProjectStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
}

model Project {
  id            String        @id @default(cuid())
  publicId      String        @unique @default(cuid()) // Secure, non-sequential ID for the public client link
  name          String
  description   String?       @db.Text
  status        ProjectStatus @default(PLANNED)
  pointsBudget  Int           // Total estimated effort for the project
  pointsUsed    Int           @default(0) // Accumulated points from completed/deployed tasks
  deadline      DateTime
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  ownerId       String
  owner         User          @relation(fields: [ownerId], references: [id])
  tasks         Task[]
}

enum TaskStatus {
  PENDING      // Task is in the backlog
  IN_PROGRESS  // Task is being actively worked on
  COMPLETED    // Development is finished, pending review/deployment
  DEPLOYED     // Task is live and points are counted towards progress
}

model Task {
  id               String     @id @default(cuid())
  title            String
  status           TaskStatus @default(PENDING)
  points           Int        // Effort points this task consumes from the project budget
  developmentHours Int?       // Optional: estimated or logged hours for the task
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  projectId        String
  project          Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```
</details>

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
-   A [PostgreSQL](https://www.postgresql.org/) database. You can run one locally using Docker or use a free provider like [Supabase](https://supabase.com/) or [Vercel Postgres](https://vercel.com/storage/postgres).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/kanban-lite.git
    cd kanban-lite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Fill in the variables in the `.env` file. See the section below for details.

4.  **Push the database schema:**
    -   This command will sync your Prisma schema with your PostgreSQL database, creating all the necessary tables.
    ```bash
    npx prisma db push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

### Environment Variables

You'll need to set the following variables in a `.env` file at the project root.

```env
# .env

# Database
# Get this from your PostgreSQL provider (e.g., Supabase, Vercel, local instance)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Next-Auth
# A secret key for signing tokens. Generate one with `openssl rand -base64 32`
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Example: Google)
# Get these from the Google Cloud Console
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server (requires `npm run build` first).
-   `npm run lint`: Lints the codebase for errors and style issues.
-   `npx prisma studio`: Opens the Prisma Studio, a GUI for your database.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
