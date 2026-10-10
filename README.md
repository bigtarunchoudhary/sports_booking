# Sports Booking Platform ⚽🏊‍♂️🏸

A modern, full-stack web application designed for booking sports venues, exploring locations via interactive maps, managing time slots, and generating QR code entry passes.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Prerequisites (Required Software)](#-prerequisites-required-software)
- [First-Time Setup Guide](#-first-time-setup-guide)
- [Available Scripts](#-available-scripts)
- [Database Management](#-database-management)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Database & ORM**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons & QR**: [Lucide React](https://lucide.dev/), [qrcode](https://www.npmjs.com/package/qrcode)

---

## 💻 Prerequisites (Required Software)

Before running the application, make sure you have the following programs downloaded and installed on your system:

### 1. Node.js (v18.0 or higher recommended)
Node.js provides the runtime environment to run JavaScript on your machine, along with `npm` (Node Package Manager) to install project dependencies.
- **Download**: [https://nodejs.org/](https://nodejs.org/) (Choose the LTS version)
- **Verify installation**:
  ```bash
  node -v
  npm -v
  ```

### 2. Git
Git is a version control system required to clone this repository.
- **Download**: [https://git-scm.com/](https://git-scm.com/)
- **Verify installation**:
  ```bash
  git --version
  ```

### 3. Code Editor (Recommended)
A modern text/code editor for exploring and modifying the source code.
- **Download**: [Visual Studio Code](https://code.visualstudio.com/)

---

## 🚀 First-Time Setup Guide

Follow these step-by-step instructions to get the platform running on your local machine:

### Step 1: Clone or Download the Project
Open your terminal (PowerShell, Command Prompt, or Terminal) and clone the repository:
```bash
git clone <repository-url>
cd sports-booking-platform
```

### Step 2: Install Project Dependencies
Install all required package dependencies defined in `package.json`:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a file named `.env` in the root directory of the project (if it doesn't already exist):
```bash
# On Windows PowerShell
New-Item -ItemType File -Name .env -Force
```

Add the following database connection URL to your `.env` file:
```env
DATABASE_URL="file:./dev.db"
```
*(This sets up SQLite to use a local database file named `dev.db` inside the `prisma` folder).*

### Step 4: Initialize & Seed the Database
Push the database schema to your local SQLite database and populate it with sample venue and slot data:

1. **Push Database Schema**:
   ```bash
   npx prisma db push
   ```
2. **Seed Sample Data**:
   ```bash
   npx prisma db seed
   ```

### Step 5: Start the Development Server
Launch the Next.js local development server:
```bash
npm run dev
```

### Step 6: Open in Browser
Open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Runs the app in development mode with live reloading |
| `npm run build` | Builds the app for production in the `.next` folder |
| `npm start` | Starts the production server after building |
| `npm run lint` | Runs ESLint to check for code style issues |

---

## 🗄 Database Management

You can inspect and manage your SQLite database visually using **Prisma Studio**:

```bash
npx prisma studio
```
This opens an interactive database interface in your browser at **[http://localhost:5555](http://localhost:5555)** where you can view, edit, and delete venues, slots, bookings, and user favorites.

---

## ❓ Troubleshooting & FAQ

<details>
<summary><b>Q: Prisma error "Database schema is not up to date"</b></summary>

Run `npx prisma db push` followed by `npx prisma db seed` to reset/sync your database structure.
</details>

<details>
<summary><b>Q: Port 3000 is already in use</b></summary>

Next.js will automatically try to use `http://localhost:3001`. Alternatively, stop any running process on port 3000 or run:
```bash
npm run dev -- -p 3001
```
</details>

<details>
<summary><b>Q: How to completely reset the database?</b></summary>

You can delete `prisma/dev.db` and re-run:
```bash
npx prisma db push
npx prisma db seed
```
</details>
