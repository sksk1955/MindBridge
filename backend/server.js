// Add these updates to your existing server.js

// Update CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-app-frontend.onrender.com', // Replace with your actual frontend URL
    // Add your frontend domain here once deployed
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Your existing middleware and routes...

// Update the server startup at the bottom:
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});