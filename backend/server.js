import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import chatRouter from './routes/chatRoute.js'

// App config
const app = express()
const port = process.env.PORT || 4000

// Middleware
app.use(express.json())
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  exposedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true
}))

// Add preflight handler for all routes
app.options('*', cors())

// API endpoints
app.use('/api', chatRouter)

// Health check route
app.get('/', (req, res) => {
  res.send('API Working')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  })
})

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`))