#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Starting application..."
node server.js
