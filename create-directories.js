/**
 * This script is used to create the necessary directory structure
 * Use: node create-directories.js
 */

const fs = require('fs');
const path = require('path');

// Define directories to create
const directories = [
    'client/public',
    'client/src',
    'client/src/components',
    'client/src/components/layout',
    'client/src/components/items',
    'client/src/components/notifications',
    'client/src/context',
    'client/src/pages',
    'client/src/services',
    'server',
    'server/controllers',
    'server/middleware',
    'server/models',
    'server/routes'
];

// Create each directory if it doesn't exist
directories.forEach(dir => {
    const directoryPath = path.join(__dirname, dir);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    } else {
        console.log(`Directory already exists: ${dir}`);
    }
});

console.log('Directory structure created successfully!');