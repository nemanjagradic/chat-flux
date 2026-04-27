# ChatFlux

A real-time full-stack chat application built with Next.js and Socket.io. ChatFlux supports direct and group messaging, live delivery and read receipts, desktop notifications, session management, and more.

**Live Demo:** [chat-flux.up.railway.app](https://chat-flux.up.railway.app)

> To explore the app without signing up, click **Continue as Guest** on the login page. Guest accounts are automatically deleted on logout.

---

## Features

### Authentication & Users

- Sign up / Sign in with email and password
- Guest login — explore the full app without creating an account
- Forgot / Reset password via email
- Welcome email on registration
- Profile management — update name, username, bio, and profile photo
- Account settings — update email and password

### Messaging

- Real-time direct messaging with WebSockets
- Group chat creation with custom name, icon, and members
- Message delivery and read receipts with exact delivered and read timestamps
- Message delivery and read receipts (single and double checkmarks)
- Messages grouped by date (Today, Yesterday, older dates)
- Message sound and desktop push notifications (configurable)

### Starred Messages

- Dedicated starred messages page — click any starred message to jump directly to it in the original conversation, highlighted for easy identification
- Per-user starring — each user has their own starred messages independently

### Conversations

- Room list with last message preview and timestamp
- Unread message count badges per room
- Search conversations by name or username
- Filter conversations by type (All, Direct, Group)

### Sessions

- View all active sessions with device info, browser, and location
- Revoke individual sessions or all other sessions at once
- Session location resolved via IP geolocation
- Device detection via UA Parser

### Notifications

- Desktop push notifications when the browser tab is in the background
- Message arrival sound when the tab is active
- Separate notification sound for background alerts
- Group message alerts — toggle notifications for group chats independently
- Do Not Disturb mode — silences all sounds and notifications at once

---

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js custom server, Socket.io, MongoDB, Mongoose
- **Storage:** Cloudinary (profile photos)
- **Email:** Resend
- **Deployment:** Railway
- **Libraries:** UA Parser (device detection), ipinfo.io (IP geolocation)

---

## Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/nemanjagradic/chat-flux.git
cd chat-flux
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root with the following:

```env
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

ENV=development

DATABASE=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_PASSWORD=<your_database_password>

EMAIL_FROM=ChatFlux <noreply@yourdomain.com>
RESEND_API_KEY=<your_resend_api_key>

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

IPINFO_API_TOKEN=<your_ipinfo_token>
```

### 4. Run in development

```bash
npm run dev
```

### 5. Build and run in production

```bash
npm run build
npm start
```

---

## Deployment

ChatFlux is deployed on [Railway](https://railway.app). The custom Node.js server compiles TypeScript via a separate `tsconfig.server.json` before serving the Next.js app alongside Socket.io.

---
