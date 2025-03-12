#!/bin/bash

echo "🔍 Checking for processes on port 3000..."
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
    echo "🛑 Killing process on port 3000 (PID: $PID)..."
    kill -9 $PID
fi

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting the application..."
npm run dev 