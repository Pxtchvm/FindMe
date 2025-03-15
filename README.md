# FindMe: School Lost and Found System

A modern, web-based Lost and Found Management System designed to streamline the process of reporting, tracking, and claiming lost items on campus.

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version: 1.0.0">
  <img src="https://img.shields.io/badge/node-v14+-yellow.svg" alt="Node: v14+">
  <img src="https://img.shields.io/badge/MongoDB-v4.4+-green.svg" alt="MongoDB: v4.4+">
</p>

## 🎯 Overview

FindMe is a comprehensive solution for managing lost and found items on school campuses. It enables students and staff to report lost items, log found items, search through existing reports, and initiate/process claims with a user-friendly interface.

## ✨ Features

- **User Authentication:** Secure registration and login system with role-based access control
- **Item Reporting:** Easy-to-use forms to report lost or found items with detailed descriptions and optional photos
- **Advanced Search:** Find items using filters for category, date, location, and status
- **Claim Management:** Request to claim items and verify ownership through the platform
- **Real-time Notifications:** Get alerts about matching items and claim updates
- **Dashboard Interface:** Intuitive dashboard for both users and administrators
- **Mobile Responsive:** Fully responsive design works on all device sizes

## 🚀 Technology Stack

### Backend

- **Node.js & Express:** Fast, unopinionated server framework
- **MongoDB:** Flexible NoSQL database
- **Mongoose:** Elegant MongoDB object modeling
- **JWT:** Secure authentication using JSON Web Tokens
- **Bcrypt:** Password hashing for enhanced security

### Frontend

- **React:** Component-based UI library
- **React Router:** Client-side routing
- **Material UI:** Modern, responsive component library
- **Axios:** Promise-based HTTP client
- **Context API:** State management across components

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## 🔧 Installation

See [INSTALL.md](./INSTALL.md) for detailed installation instructions.

Quick start:

```bash
# Clone repository
git clone https://github.com/yourusername/findme-app.git
cd findme-app

# Install all dependencies
npm run install-all

# Configure environment variables
# (Create .env file in server directory)

# Start the application (both server and client)
npm run dev
```

## 📱 App Screenshots

### Login Page

![Login Page](https://via.placeholder.com/600x300?text=Login+Page)

### Dashboard

![Dashboard](https://via.placeholder.com/600x300?text=Dashboard)

### Report Item Form

![Report Item](https://via.placeholder.com/600x300?text=Report+Item+Form)

### Item Details

![Item Details](https://via.placeholder.com/600x300?text=Item+Details)

## 📊 Project Structure

```
findme-app/
├── client/             # Frontend React application
│   ├── public/         # Static files
│   └── src/            # React source code
│       ├── components/ # Reusable UI components
│       ├── context/    # React Context for state management
│       ├── pages/      # Page components
│       └── services/   # API services
├── server/             # Backend Express API
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   └── routes/         # API routes
├── .gitignore          # Git ignore file
├── package.json        # Root package.json for scripts
└── README.md           # Project documentation
```

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Kurt Wilson T. Rojo (Team Lead)
- Katrina Ericka C. De Guzman
- Tyrell John C. Del Carmen
- Jacob O. Duldulao
- Francine Ann M. Rosal

## 🙏 Acknowledgements

- [Material UI](https://mui.com/) for the amazing component library
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Express](https://expressjs.com/) for the robust backend framework
- [React](https://reactjs.org/) for the powerful frontend library
