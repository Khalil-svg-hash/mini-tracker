# 🎯 Mini Tracker

<div align="center">

**A lightweight task management Telegram Mini App - Jira Lite for small teams**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Local Development Setup](#-local-development-setup)
- [Telegram Bot Setup](#-telegram-bot-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Mini Tracker** is a modern, lightweight task management solution built as a Telegram Mini App. It provides small teams with essential project management features similar to Jira, but with a simpler, more streamlined interface accessible directly through Telegram.

The application leverages Telegram's Mini App platform to deliver a seamless, native-like experience without requiring users to install a separate application. Perfect for teams already using Telegram for communication who want integrated task tracking.

### Why Mini Tracker?

- **🚀 Seamless Integration** - Lives inside Telegram, no separate app needed
- **⚡ Lightweight** - Fast, responsive, and resource-efficient
- **👥 Team-Focused** - Built for small teams and agile workflows
- **🔒 Secure** - Leverages Telegram's security infrastructure
- **💼 Professional** - Enterprise-grade features in a simple package

---

## ✨ Features

### Core Features
- ✅ **Task Management** - Create, update, delete, and organize tasks
- 📊 **Kanban Boards** - Visual workflow management with drag-and-drop
- 📁 **Projects & Workspaces** - Organize work into logical groups
- 👤 **User Management** - Team member roles and permissions
- 💬 **Comments & Activity** - Collaborate on tasks with real-time updates
- 🔔 **Notifications** - Stay informed with Telegram notifications
- ⏰ **Reminders** - Never miss important deadlines
- 📅 **Calendar View** - Visualize tasks and deadlines

### Advanced Features
- 🔍 **Search & Filter** - Quickly find tasks and projects
- 📈 **Activity Tracking** - Monitor team progress and task history
- 🎨 **Customizable Workflows** - Adapt boards to your team's needs
- 🔐 **JWT Authentication** - Secure API access
- 🔄 **Real-time Updates** - Stay synchronized across devices

---

## 🏗️ Architecture

Mini Tracker is built as a **monorepo** using npm workspaces, containing two main applications:

```
mini-tracker/
├── apps/
│   ├── api/          # NestJS Backend (REST API + Telegram Bot)
│   └── web/          # React Frontend (Telegram Mini App)
├── docker-compose.yml
└── package.json      # Root workspace configuration
```

### Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Telegram Platform                 │
│  ┌─────────────┐        ┌────────────────┐ │
│  │  Telegram   │◄──────►│  Mini Tracker  │ │
│  │     Bot     │        │    Web App     │ │
│  └──────┬──────┘        └────────┬───────┘ │
└─────────┼──────────────────────────┼────────┘
          │                          │
          │ Bot API                  │ HTTPS
          │                          │
┌─────────▼──────────────────────────▼────────┐
│            Mini Tracker Backend             │
│  ┌──────────────────────────────────────┐   │
│  │         NestJS API Server            │   │
│  │  ┌─────────────┐  ┌──────────────┐  │   │
│  │  │   REST API  │  │ Telegram Bot │  │   │
│  │  └─────────────┘  └──────────────┘  │   │
│  └──────────────────────────────────────┘   │
│                    │                        │
│         ┌──────────┼──────────┐             │
│         │          │          │             │
│    ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐        │
│    │TypeORM │ │  Bull  │ │  JWT   │        │
│    └────┬───┘ └───┬────┘ └────────┘        │
└─────────┼─────────┼──────────────────────────┘
          │         │
     ┌────▼────┐ ┌─▼──────┐
     │PostgreSQL│ │ Redis  │
     └──────────┘ └────────┘
```

### Key Components

- **Frontend (React + Vite)**: Telegram Mini App interface
- **Backend (NestJS)**: RESTful API server with Telegram bot integration
- **Database (PostgreSQL)**: Persistent data storage
- **Cache/Queue (Redis)**: Session management and background job processing
- **Bot Integration (Telegraf)**: Telegram Bot API wrapper

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) 10.x - Progressive Node.js framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **Database ORM**: [TypeORM](https://typeorm.io/) 0.3.x - SQL database abstraction
- **Database**: [PostgreSQL](https://www.postgresql.org/) 15 - Relational database
- **Cache/Queue**: [Redis](https://redis.io/) 7 - In-memory data store
- **Job Queue**: [Bull](https://github.com/OptimalBits/bull) 4.x - Redis-based queue
- **Telegram Bot**: [Telegraf](https://telegraf.js.org/) 4.x - Telegram Bot framework
- **Authentication**: [Passport](http://www.passportjs.org/) + JWT
- **Validation**: [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer)

### Frontend
- **Framework**: [React](https://reactjs.org/) 18.2 - UI library
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **Build Tool**: [Vite](https://vitejs.dev/) 5.x - Next-generation frontend tooling
- **Routing**: [React Router](https://reactrouter.com/) 6.x
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) 4.x - Lightweight state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) (React Query) 5.x
- **HTTP Client**: [Axios](https://axios-http.com/) 1.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.x
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) - Modern drag and drop toolkit
- **Telegram SDK**: [@twa-dev/sdk](https://github.com/twa-dev/sdk) - Telegram Web App SDK
- **Date Utilities**: [date-fns](https://date-fns.org/) 3.x

### DevOps & Tools
- **Containerization**: [Docker](https://www.docker.com/) + Docker Compose
- **Package Manager**: npm workspaces
- **Process Manager**: [Concurrently](https://github.com/open-cli-tools/concurrently)
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest (Backend) + Supertest (E2E)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/get-started))
- **npm** or **pnpm** (npm comes with Node.js, [pnpm installation](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

### Optional but Recommended
- **PostgreSQL** 15+ (for local development without Docker)
- **Redis** 7+ (for local development without Docker)

### Verify Installation

```bash
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
docker --version  # Should be >= 20.0.0
docker-compose --version
```

---

## 🚀 Quick Start with Docker

The fastest way to get Mini Tracker up and running is with Docker Compose:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mini-tracker.git
cd mini-tracker
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set the required variables:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
JWT_SECRET=your_random_secret_key_here
WEBAPP_URL=https://your-webapp-url.com
```

### 3. Start All Services

```bash
docker-compose up -d
```

This command will:
- ✅ Start PostgreSQL database (port 5432)
- ✅ Start Redis cache (port 6379)
- ✅ Build and start the API server (port 3000)
- ✅ Build and start the web application (port 8080)

### 4. Verify Services

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web
```

### 5. Access the Application

- **Web Application**: http://localhost:8080
- **API Server**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

### 6. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

---

## 💻 Local Development Setup

For development with hot-reload and debugging capabilities:

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/mini-tracker.git
cd mini-tracker

# Install all dependencies (root + workspaces)
npm install
```

### 2. Start Database Services

You can use Docker for just the database services:

```bash
# Start only PostgreSQL and Redis
docker-compose up -d postgres redis

# Verify they're running
docker-compose ps
```

Alternatively, install and run PostgreSQL and Redis locally.

### 3. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env
```

Update `.env` with your local configuration:

```env
# Database
DATABASE_URL=postgres://minitracker:minitracker@localhost:5432/minitracker

# Redis
REDIS_URL=redis://localhost:6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# JWT
JWT_SECRET=your_random_secret_key_here

# URLs
WEBAPP_URL=https://your-ngrok-url.ngrok.io
API_URL=http://localhost:3000

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Run Migrations (if applicable)

```bash
# Navigate to API directory
cd apps/api

# Run database migrations
npm run migration:run

# Or sync TypeORM entities (development only)
# Migrations are handled automatically on app start
```

### 5. Start Development Servers

```bash
# From root directory - starts both API and Web
npm run dev

# Or start individually:
npm run dev:api    # API server on port 3000
npm run dev:web    # Web app on port 5173 (Vite default)
```

### 6. Development URLs

- **Web Application**: http://localhost:5173 (Vite dev server)
- **API Server**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api (if Swagger is configured)

### 7. Build for Production

```bash
# Build all workspaces
npm run build

# Build individually
npm run build:api
npm run build:web

# Start production API server
npm run start
```

---

## 🤖 Telegram Bot Setup

To integrate Mini Tracker with Telegram, you need to create a bot and configure it as a Mini App.

### Step 1: Create a Telegram Bot

1. **Open Telegram** and search for [@BotFather](https://t.me/botfather)
2. **Start a chat** and send `/newbot`
3. **Follow the prompts**:
   - Enter a name for your bot (e.g., "Mini Tracker")
   - Enter a username (must end in 'bot', e.g., "minitracker_bot")
4. **Save the token** - BotFather will provide a token like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Step 2: Configure Bot Settings

```bash
# Set bot description
/setdescription
# Select your bot
# Enter: "Lightweight task management for teams"

# Set bot about text
/setabouttext
# Select your bot
# Enter: "Mini Tracker - Jira Lite for Telegram"

# Set bot profile photo (optional)
/setuserpic
# Select your bot and upload an image
```

### Step 3: Create a Mini App

1. **Send** `/newapp` to BotFather
2. **Select** your bot
3. **Enter** a title: "Mini Tracker"
4. **Enter** a description: "Lightweight task management application"
5. **Upload** a photo (640x360px recommended)
6. **Upload** a GIF demo (optional)
7. **Enter** the Web App URL:
   - For development: Your ngrok URL (see below)
   - For production: `https://your-domain.com`

### Step 4: Set Web App URL

```bash
# Send to BotFather
/myapps
# Select your bot
# Select your app
# Choose "Edit Web App URL"
# Enter your HTTPS URL
```

### Step 5: Configure Environment Variables

Add your bot token to `.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
WEBAPP_URL=https://your-webapp-url.com
```

### Step 6: Local Development with ngrok

For local development, you need HTTPS. Use [ngrok](https://ngrok.com/):

```bash
# Install ngrok
npm install -g ngrok

# Start your web app
npm run dev:web

# In another terminal, expose port 5173
ngrok http 5173

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update .env WEBAPP_URL with this URL
# Update BotFather Web App URL with this URL
```

### Step 7: Test Your Bot

1. **Open Telegram** and find your bot
2. **Send** `/start` to your bot
3. **Click** the keyboard button or use the bot menu to launch the Mini App
4. Your Mini Tracker app should open inside Telegram! 🎉

### Bot Commands (Optional)

Configure bot commands for better UX:

```bash
# Send to BotFather
/setcommands
# Select your bot
# Enter commands:

start - Launch Mini Tracker
help - Get help and documentation
tasks - View your tasks
projects - View your projects
notifications - Manage notifications
```

### Troubleshooting

- **Bot not responding**: Check `TELEGRAM_BOT_TOKEN` in `.env`
- **Mini App won't load**: Ensure `WEBAPP_URL` is HTTPS and accessible
- **CORS errors**: Check API CORS configuration for Telegram origin
- **White screen**: Check browser console for errors, verify `VITE_API_URL`

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/dbname` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from BotFather | `123456789:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `JWT_SECRET` | Secret key for JWT token signing | `your_random_secret_key_min_32_chars` |
| `WEBAPP_URL` | Frontend application URL (HTTPS required) | `https://app.example.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_API_URL` | Frontend API endpoint | `http://localhost:3000/api/v1` |
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |

### Generating Secrets

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

### Environment Files

```bash
.env                 # Local development (gitignored)
.env.example         # Template with placeholder values
.env.production      # Production environment (gitignored)
.env.test            # Test environment (gitignored)
```

### Docker Environment

When using Docker Compose, variables can be:
1. Defined in `.env` file (automatically loaded)
2. Passed directly in `docker-compose.yml`
3. Set as system environment variables

---

## 📚 API Documentation

The API follows RESTful conventions and uses JWT authentication for protected endpoints.

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

#### Authentication

```http
POST   /api/v1/auth/login          # Authenticate with Telegram
POST   /api/v1/auth/logout         # Logout user
GET    /api/v1/auth/me             # Get current user
```

#### Users

```http
GET    /api/v1/users               # List all users
GET    /api/v1/users/:id           # Get user by ID
PATCH  /api/v1/users/:id           # Update user
DELETE /api/v1/users/:id           # Delete user
```

#### Workspaces

```http
GET    /api/v1/workspaces          # List workspaces
POST   /api/v1/workspaces          # Create workspace
GET    /api/v1/workspaces/:id      # Get workspace
PATCH  /api/v1/workspaces/:id      # Update workspace
DELETE /api/v1/workspaces/:id      # Delete workspace
```

#### Projects

```http
GET    /api/v1/projects            # List projects
POST   /api/v1/projects            # Create project
GET    /api/v1/projects/:id        # Get project
PATCH  /api/v1/projects/:id        # Update project
DELETE /api/v1/projects/:id        # Delete project
```

#### Boards

```http
GET    /api/v1/boards              # List boards
POST   /api/v1/boards              # Create board
GET    /api/v1/boards/:id          # Get board with columns
PATCH  /api/v1/boards/:id          # Update board
DELETE /api/v1/boards/:id          # Delete board
```

#### Tasks

```http
GET    /api/v1/tasks               # List tasks (with filters)
POST   /api/v1/tasks               # Create task
GET    /api/v1/tasks/:id           # Get task details
PATCH  /api/v1/tasks/:id           # Update task
DELETE /api/v1/tasks/:id           # Delete task
POST   /api/v1/tasks/:id/assign    # Assign task to user
POST   /api/v1/tasks/:id/move      # Move task to different column
```

#### Comments

```http
GET    /api/v1/comments            # List comments (by task)
POST   /api/v1/comments            # Create comment
GET    /api/v1/comments/:id        # Get comment
PATCH  /api/v1/comments/:id        # Update comment
DELETE /api/v1/comments/:id        # Delete comment
```

#### Activity

```http
GET    /api/v1/activity            # Get activity feed
GET    /api/v1/activity/task/:id   # Get task activity
GET    /api/v1/activity/user/:id   # Get user activity
```

#### Notifications

```http
GET    /api/v1/notifications       # List notifications
PATCH  /api/v1/notifications/:id   # Mark as read
DELETE /api/v1/notifications/:id   # Delete notification
POST   /api/v1/notifications/read-all  # Mark all as read
```

#### Reminders

```http
GET    /api/v1/reminders           # List reminders
POST   /api/v1/reminders           # Create reminder
PATCH  /api/v1/reminders/:id       # Update reminder
DELETE /api/v1/reminders/:id       # Delete reminder
```

#### Calendar

```http
GET    /api/v1/calendar            # Get calendar view
GET    /api/v1/calendar/range      # Get tasks in date range
```

### Request Examples

#### Create a Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "projectId": "uuid-here",
    "assigneeId": "uuid-here",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-12-31"
  }'
```

#### Update a Task

```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/task-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "urgent"
  }'
```

#### Get Tasks with Filters

```bash
# Get tasks for a specific project
curl -X GET "http://localhost:3000/api/v1/tasks?projectId=uuid-here" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get tasks assigned to current user
curl -X GET "http://localhost:3000/api/v1/tasks?assignedToMe=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get tasks by status
curl -X GET "http://localhost:3000/api/v1/tasks?status=in_progress" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Task title",
    "status": "todo",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Task not found",
    "statusCode": 404,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Rate Limiting

API implements rate limiting to prevent abuse:
- **Authenticated requests**: 100 requests per minute
- **Unauthenticated requests**: 20 requests per minute

### Pagination

List endpoints support pagination:

```bash
GET /api/v1/tasks?page=1&limit=20
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 📁 Project Structure

```
mini-tracker/
├── apps/
│   ├── api/                          # Backend application
│   │   ├── src/
│   │   │   ├── modules/              # Feature modules
│   │   │   │   ├── auth/             # Authentication module
│   │   │   │   ├── users/            # User management
│   │   │   │   ├── workspaces/       # Workspace management
│   │   │   │   ├── projects/         # Project management
│   │   │   │   ├── boards/           # Kanban boards
│   │   │   │   ├── tasks/            # Task management
│   │   │   │   ├── comments/         # Task comments
│   │   │   │   ├── activity/         # Activity tracking
│   │   │   │   ├── notifications/    # Notification system
│   │   │   │   ├── reminders/        # Reminder management
│   │   │   │   └── calendar/         # Calendar views
│   │   │   ├── common/               # Shared utilities
│   │   │   │   ├── decorators/       # Custom decorators
│   │   │   │   ├── filters/          # Exception filters
│   │   │   │   ├── guards/           # Auth guards
│   │   │   │   ├── interceptors/     # Response interceptors
│   │   │   │   └── pipes/            # Validation pipes
│   │   │   ├── entities/             # TypeORM entities
│   │   │   ├── app.module.ts         # Root module
│   │   │   └── main.ts               # Application entry point
│   │   ├── test/                     # E2E tests
│   │   ├── Dockerfile                # API Docker configuration
│   │   ├── package.json              # API dependencies
│   │   └── tsconfig.json             # TypeScript config
│   │
│   └── web/                          # Frontend application
│       ├── src/
│       │   ├── components/           # React components
│       │   │   ├── common/           # Reusable UI components
│       │   │   ├── layout/           # Layout components
│       │   │   ├── tasks/            # Task components
│       │   │   ├── boards/           # Board components
│       │   │   └── ...
│       │   ├── pages/                # Page components
│       │   │   ├── Home.tsx
│       │   │   ├── Board.tsx
│       │   │   ├── Tasks.tsx
│       │   │   ├── Projects.tsx
│       │   │   └── ...
│       │   ├── stores/               # Zustand state stores
│       │   │   ├── authStore.ts
│       │   │   ├── taskStore.ts
│       │   │   └── ...
│       │   ├── api/                  # API client functions
│       │   │   ├── client.ts         # Axios instance
│       │   │   ├── tasks.ts
│       │   │   ├── projects.ts
│       │   │   └── ...
│       │   ├── hooks/                # Custom React hooks
│       │   │   ├── useTasks.ts
│       │   │   ├── useAuth.ts
│       │   │   └── ...
│       │   ├── types/                # TypeScript types
│       │   ├── constants/            # App constants
│       │   ├── App.tsx               # Root component
│       │   ├── main.tsx              # Application entry point
│       │   └── index.css             # Global styles
│       ├── public/                   # Static assets
│       ├── Dockerfile                # Web Docker configuration
│       ├── index.html                # HTML template
│       ├── package.json              # Web dependencies
│       ├── tailwind.config.js        # Tailwind configuration
│       ├── vite.config.ts            # Vite configuration
│       └── tsconfig.json             # TypeScript config
│
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # Production Docker setup
├── docker-compose.dev.yml            # Development Docker setup
├── package.json                      # Root workspace config
├── README.md                         # This file
└── LICENSE                           # License file
```

### Key Directories Explained

- **`apps/api/src/modules/`** - Each module represents a domain feature with controller, service, and repository
- **`apps/api/src/common/`** - Shared utilities, guards, decorators used across modules
- **`apps/api/src/entities/`** - TypeORM database entities/models
- **`apps/web/src/pages/`** - Top-level page components mapped to routes
- **`apps/web/src/components/`** - Reusable UI components organized by feature
- **`apps/web/src/api/`** - API client functions using Axios and React Query
- **`apps/web/src/stores/`** - Zustand stores for global state management

---

## 🚢 Deployment

### Deployment Options

Mini Tracker can be deployed using various methods:

1. **Docker Compose** (Recommended for VPS/Cloud)
2. **Kubernetes** (For scalable production)
3. **Cloud Platforms** (Heroku, Railway, Render, etc.)
4. **Traditional VPS** (Manual setup)

### Docker Compose Deployment (Recommended)

#### Prerequisites
- VPS or cloud instance (Ubuntu 20.04+ recommended)
- Docker and Docker Compose installed
- Domain name pointed to your server
- SSL certificate (Let's Encrypt recommended)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
```

#### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/yourusername/mini-tracker.git
cd mini-tracker

# Copy and configure environment
cp .env.example .env
nano .env
```

Configure production variables:

```env
DATABASE_URL=postgres://minitracker:STRONG_PASSWORD@postgres:5432/minitracker
REDIS_URL=redis://redis:6379
TELEGRAM_BOT_TOKEN=your_production_bot_token
JWT_SECRET=your_production_secret_64_chars_minimum
WEBAPP_URL=https://your-domain.com
VITE_API_URL=https://api.your-domain.com/api/v1
NODE_ENV=production
```

#### Step 3: Setup SSL with Nginx

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Step 4: Get SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

#### Step 5: Deploy

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### Step 6: Setup Auto-restart

Create systemd service `/etc/systemd/system/mini-tracker.service`:

```ini
[Unit]
Description=Mini Tracker
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/mini-tracker
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable mini-tracker
sudo systemctl start mini-tracker
```

### Environment-Specific Configurations

#### Production Checklist
- ✅ Use strong passwords for database
- ✅ Set secure JWT_SECRET (64+ characters)
- ✅ Enable HTTPS/SSL
- ✅ Configure CORS properly
- ✅ Set up database backups
- ✅ Enable logging and monitoring
- ✅ Set up firewall rules
- ✅ Configure rate limiting
- ✅ Use production-grade Redis password

#### Security Best Practices
- Use environment variables, never commit secrets
- Regularly update dependencies
- Implement rate limiting
- Use HTTPS everywhere
- Enable database SSL connections
- Regular security audits
- Implement backup strategy

### Database Backups

```bash
# Backup PostgreSQL
docker exec minitracker-postgres pg_dump -U minitracker minitracker > backup.sql

# Restore from backup
docker exec -i minitracker-postgres psql -U minitracker minitracker < backup.sql

# Automated daily backups (cron)
0 2 * * * docker exec minitracker-postgres pg_dump -U minitracker minitracker > /backups/mini-tracker-$(date +\%Y\%m\%d).sql
```

### Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Monitor resource usage
docker stats

# Check health
curl http://localhost:3000/health
```

### Scaling Considerations

For high-traffic scenarios:
- Use managed PostgreSQL (AWS RDS, DigitalOcean Managed DB)
- Use managed Redis (AWS ElastiCache, Redis Cloud)
- Deploy multiple API instances behind load balancer
- Implement CDN for static assets
- Use Kubernetes for orchestration

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🧪 Write tests
- 🎨 Improve UI/UX

### Development Workflow

1. **Fork the Repository**

```bash
# Click "Fork" on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/mini-tracker.git
cd mini-tracker
git remote add upstream https://github.com/original-owner/mini-tracker.git
```

2. **Create a Feature Branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

3. **Make Your Changes**

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

4. **Test Your Changes**

```bash
# Run backend tests
cd apps/api
npm run test

# Run linter
npm run lint

# Build to verify no errors
npm run build
```

5. **Commit Your Changes**

```bash
# Use conventional commits format
git add .
git commit -m "feat: add task filtering by priority"
git commit -m "fix: resolve calendar date rendering issue"
git commit -m "docs: update API documentation"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

6. **Push and Create Pull Request**

```bash
git push origin feature/your-feature-name
```

Go to GitHub and create a Pull Request with:
- Clear title and description
- Reference any related issues
- Screenshots for UI changes
- Test results if applicable

### Code Style Guidelines

#### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Prefer const over let
- Use async/await over promises
- Add JSDoc comments for public APIs

#### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props
- Follow React best practices

#### Backend (NestJS)
- One module per feature
- Use DTOs for validation
- Keep controllers thin
- Business logic in services
- Use dependency injection

### Pull Request Review Process

1. Automated checks must pass (linting, tests)
2. Code review by maintainers
3. Address feedback and comments
4. Squash commits if requested
5. Merge when approved

### Getting Help

- 💬 Join our [Telegram group](https://t.me/your-group)
- 📧 Email: support@minitracker.dev
- 🐛 [GitHub Issues](https://github.com/yourusername/mini-tracker/issues)
- 📖 Check existing documentation

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person
- Follow community guidelines

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Mini Tracker Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://reactjs.org/) - UI library
- [Telegram](https://telegram.org/) - Messaging platform and Mini Apps
- [Telegraf](https://telegraf.js.org/) - Telegram bot framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- All our [contributors](https://github.com/yourusername/mini-tracker/graphs/contributors)

---

## 📞 Support

Need help? We're here for you:

- 📖 **Documentation**: This README and inline code comments
- 💬 **Telegram**: [@mini_tracker_support](https://t.me/mini_tracker_support)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/mini-tracker/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/mini-tracker/discussions)
- 📧 **Email**: support@minitracker.dev

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ Core task management
- ✅ Kanban boards
- ✅ Telegram bot integration
- ✅ User authentication
- ✅ Comments and activity tracking

### Upcoming Features (v1.1)
- 🔄 Real-time collaboration with WebSockets
- 📊 Advanced analytics and reporting
- 🏷️ Custom labels and tags
- 🔗 Task dependencies
- 📎 File attachments

### Future Plans (v2.0)
- 🤖 AI-powered task suggestions
- 📱 Native mobile apps
- 🌍 Multi-language support
- 🔌 Third-party integrations (GitHub, GitLab, Jira)
- 📈 Team performance metrics

---

<div align="center">

**Made with ❤️ by the Mini Tracker team**

[Website](https://minitracker.dev) • [Documentation](https://docs.minitracker.dev) • [Demo](https://demo.minitracker.dev)

⭐ **Star us on GitHub if you find this project useful!** ⭐

</div>