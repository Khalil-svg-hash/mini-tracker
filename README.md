# Mini Tracker 📋

A lightweight task management Telegram Mini App - "Jira Lite" for small teams.

## Features ✨

- 📱 **Telegram Mini App** - Seamless integration with Telegram
- 🎯 **Task Management** - Create, edit, and delete tasks
- 📊 **Status Tracking** - Organize tasks by status (To Do, In Progress, Done)
- 🎨 **Priority Levels** - Set task priorities (Low, Medium, High)
- 🤖 **Bot Commands** - Interact with tasks via Telegram bot
- 🎨 **Native Look** - Uses Telegram theme colors for a native feel
- 📱 **Mobile First** - Optimized for mobile devices

## Project Structure 📁

```
mini-tracker/
├── apps/
│   ├── api/              # Backend API server
│   │   ├── src/
│   │   │   └── index.js  # Express server with REST API
│   │   └── package.json
│   └── web/              # Frontend Telegram Mini App
│       ├── src/
│       │   ├── main.js   # Application logic
│       │   └── style.css # Styling
│       ├── index.html    # Main HTML file
│       ├── vite.config.js
│       └── package.json
├── .env.example          # Environment variables template
├── .gitignore
├── package.json          # Root workspace config
└── README.md
```

## Setup Instructions 🚀

### Prerequisites

- Node.js >= 18.0.0
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### 1. Clone the Repository

```bash
git clone https://github.com/Khalil-svg-hash/mini-tracker.git
cd mini-tracker
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (root, api, and web).

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Telegram Bot Token:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
PORT=3000
NODE_ENV=development
WEB_APP_URL=http://localhost:5173
```

### 4. Run in Development Mode

```bash
npm run dev
```

This will start both the API server (port 3000) and the web app (port 5173).

- **API**: http://localhost:3000
- **Web App**: http://localhost:5173

## Telegram Bot Setup 🤖

### 1. Create a Bot with BotFather

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token and add it to your `.env` file

### 2. Set up the Web App

1. Send `/mybots` to BotFather
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Send the URL of your deployed web app (or `http://localhost:5173` for testing)

### 3. (Optional) Set up Mini App

For production deployment:

1. Deploy your web app to a hosting service (Vercel, Netlify, etc.)
2. Send `/setmenubutton` to BotFather
3. Enter your deployed web app URL

## Deployment 🌐

### Deploy to Vercel

#### Backend API (apps/api)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy the API:
```bash
cd apps/api
vercel
```

3. Add environment variables in Vercel dashboard:
   - `TELEGRAM_BOT_TOKEN`
   - `NODE_ENV=production`

#### Frontend Web App (apps/web)

1. Deploy the web app:
```bash
cd apps/web
vercel
```

2. Update your `.env` file with the deployed API URL in the web app's `main.js`:
```javascript
const API_URL = 'https://your-api-url.vercel.app';
```

### Deploy to Netlify

#### Frontend Web App

1. Build the web app:
```bash
cd apps/web
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Update the API URL in `main.js` to point to your deployed backend

## API Endpoints 🔌

### Tasks

- `GET /tasks` - List all tasks
  - Query params: `status` (todo/in-progress/done), `priority` (low/medium/high)
- `POST /tasks` - Create a new task
  - Body: `{ title, description, status, priority }`
- `PUT /tasks/:id` - Update a task
  - Body: `{ title, description, status, priority }`
- `DELETE /tasks/:id` - Delete a task

### Example Request

```bash
# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build feature X",
    "description": "Implement the new feature",
    "status": "todo",
    "priority": "high"
  }'
```

## Bot Commands 💬

- `/start` - Start the bot and open the Mini Tracker app
- `/tasks` - View all tasks in Telegram chat
- `/help` - Show help information

## Development 🛠️

### Run API Only

```bash
npm run dev:api
```

### Run Web App Only

```bash
npm run dev:web
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Tech Stack 💻

### Backend
- Node.js
- Express.js
- node-telegram-bot-api
- CORS
- dotenv

### Frontend
- Vite
- Vanilla JavaScript
- Telegram Web App SDK
- CSS3

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for your own purposes.

## Support 💬

For issues and questions, please open an issue on GitHub or contact the maintainer.

---

Made with ❤️ for small teams who need simple task management