# Backend - Women's Health AI Assistant

This directory contains the backend Node.js server for the Women's Health AI Assistant.

## Overview

The backend provides API endpoints for the frontend, handles AI model integration, and manages conversation context.

For complete documentation including setup instructions, architecture, and development guidelines, please refer to the [main README](../README.md) in the project root.

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start
```

## Technology Stack

- Node.js
- Express
- OpenAI API
- MongoDB (optional)
- And more (see the main README)

## API Endpoints

- **POST /api/chat**: Send a message to the AI assistant
  - Request body: `{ message: string, sessionId: string }`
  - Response: `{ success: boolean, data: string }`

