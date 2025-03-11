# FindMe: School Lost and Found System

A web-based Lost and Found Management System that streamlines the process of logging, tracking, and claiming lost items on campus.

## Features

- **User Authentication**: Secure login/register system with role-based access
- **Report Lost Items**: Students and staff can report items they've lost
- **Report Found Items**: Students and staff can report items they've found
- **Search System**: Advanced search to find lost or found items
- **Claim Process**: Request to claim found items with verification
- **Notifications**: Get alerts about matches and updates
- **Dashboard**: User-friendly dashboard to manage reports and claims

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/findme-app.git
   cd findme-app
   ```

2. Install dependencies:
   ```
   # Install all dependencies
   npm run install-all
   
   # Or install separately:
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/findme
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development server:
   ```
   # Start both server and client
   npm run dev
   
   # Or start separately:
   # Start server
   npm run server
   
   # Start client
   npm run client
   ```

5. Access the application:
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

## Project Structure

```
findme-app/
├── client/             # Frontend React application
└── server/             # Backend Express API
```

## License

This project is licensed under the MIT License.