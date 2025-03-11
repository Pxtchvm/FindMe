# FindMe App Installation Guide

This guide will walk you through the steps to set up and run the FindMe Lost and Found Management System.

## Prerequisites

Before installing the application, make sure you have the following:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/findme-app.git
cd findme-app
```

## Step 2: Install Dependencies

Install the root dependencies:

```bash
npm install
```

Install the server dependencies:

```bash
cd server
npm install
cd ..
```

Install the client dependencies:

```bash
cd client
npm install
cd ..
```

Alternatively, you can use the shortcut script:

```bash
npm run install-all
```

## Step 3: Configure Environment Variables

1. In the `server` directory, create a `.env` file:

```bash
cd server
cp .env.example .env
```

2. Open the `.env` file and update the values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/findme
JWT_SECRET=your_jwt_secret_key
```

Replace `your_jwt_secret_key` with a strong, random string for security.

## Step 4: Set Up MongoDB

1. Make sure MongoDB is running on your system. If you need to start it:

```bash
# On Windows
net start MongoDB

# On macOS/Linux (if installed via Homebrew)
brew services start mongodb-community

# On Linux (if installed via apt)
sudo systemctl start mongod
```

2. Create a new database named `findme`:

```bash
mongo
> use findme
> exit
```

## Step 5: Start the Application

You can start both the server and client with a single command:

```bash
npm run dev
```

Or start them separately:

```bash
# Start the server (from the root directory)
npm run server

# Start the client (from the root directory)
npm run client
```

The server will run on http://localhost:5000, and the client will run on http://localhost:3000.

## Step 6: First-time Setup

1. Open http://localhost:3000 in your web browser
2. Register a new admin account:
   - Click on "Register" in the navigation bar
   - Fill in the registration form
   - Select "Admin" as the role (this option may be restricted in a production environment)
   - Click "Register"
3. Log in with your new account

## Troubleshooting

### Server won't start

- Check if MongoDB is running
- Make sure the port 5000 is not being used by another application
- Verify your `.env` file has the correct MongoDB URI

### Client won't start

- Make sure you have installed all dependencies
- Check if port 3000 is not being used by another application

### Connection issues between client and server

- Verify that both the client and server are running
- Check that the proxy setting in `client/package.json` points to the correct server URL

## Deployment

For production deployment:

1. Build the client:

```bash
cd client
npm run build
cd ..
```

2. Set up environment variables for production:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

3. Deploy to your preferred hosting provider (Heroku, AWS, DigitalOcean, etc.)

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)