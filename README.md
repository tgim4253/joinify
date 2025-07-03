# Joinify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern event management and attendance tracking system designed to streamline the process of organizing events like university homecomings.

## 🎯 Core Problem & Goal

This project aims to solve the inefficiencies of traditional event management, such as:

-   Manually calling alumni (OBs) to confirm attendance.
-   The tedious process of matching Slack responses with attendee lists.

Our goal is to create a centralized platform that offers:

1.  **Effortless Event Creation**: Admins can easily set up new events with all necessary details.
2.  **Smart Roster Management**: Upload attendee lists (CSV) and manage custom statuses (e.g., Attending, Absent, TBD).
3.  **Interactive Dashboards**: Provide a clear overview of event status for both admins and general users.
4.  **Seamless Slack Integration**: Allow users to respond to event invitations directly via Slack, with automatic updates to the database.

## ✨ Key Features

-   **Admin Dashboard**: Full control over events, custom data fields, and member lists.
-   **Public-Facing Pages**: Clean, read-only views of event details and public attendee lists.
-   **Customizable Fields**: Define unique data fields for each event (e.g., student ID, major, custom status).
-   **Data Masking**: Protect sensitive personal information (e.g., `홍*동`, `010-****-1234`).
-   **Slack Bot**: Users can interact with the system using slash commands (`/joinify`, `/status`) and interactive buttons.
-   **Virtual Scrolling**: Efficiently handles large attendee lists for a smooth user experience.

## 🛠️ Tech Stack

| Category      | Technology                                           |
|---------------|------------------------------------------------------|
| **Backend**   | Node.js, Express 5, TypeScript, PostgreSQL, Prisma   |
| **Frontend**  | React, TypeScript, Vite                              |
| **Hosting**   | (To be determined)                                   |
| **DevOps**    | Docker, GitHub Actions                               |

## 📂 Project Structure

This project uses a monorepo-like structure, with the backend and frontend code located in their respective directories:

```
/
├── backend/      # Node.js + Express API
├── frontend/     # React + Vite Client
├── docs/         # Design documents
└── package.json  # Root scripts to manage both workspaces
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   Docker and Docker Compose

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd joinify
    ```

2.  **Install all dependencies:**
    The root `postinstall` script will automatically navigate into `backend` and `frontend` to install their dependencies.
    ```bash
    npm install
    ```

### Running the Application

You can run each service in a separate terminal. Make sure you have a PostgreSQL instance running and have configured the environment variables correctly.

```bash
# Terminal 1: Start the backend server
npm run start:backend

# Terminal 2: Start the frontend development server
npm run start:frontend
```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
