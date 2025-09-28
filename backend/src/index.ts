import 'reflect-metadata'
import express from 'express'
import client from 'prom-client'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import ownerRoutes from './routes/owner.routes'
import { connectDB } from './config/db'
import { connectRedis } from './config/redis'
import { errorHandler } from './middlewares/error.handler'
import morgan from 'morgan'
import logger from './utils/logger'

const app = express()
const PORT = process.env.PORT || 8000
const register = new client.Registry()

const requestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

register.registerMetric(requestsCounter)

app.use((req, res, next) => {
  res.on('finish', () => {
    requestsCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    })
  })
  next()
})

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(
  morgan(':method :url :status :response-time ms', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
)

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests, please try again later.',
  })
)

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const noCachePaths = [
    '/login',
    '/signup',
    '/verify-otp',
    '/forget-password',
    '/verify-reset-otp',
    '/reset-password',
  ]

  if (noCachePaths.some((path) => req.path.includes(path))) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Surrogate-Control', 'no-store')
  }

  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/owner', ownerRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running ')
})

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType)
  res.end(await register.metrics())
})

app.use(errorHandler)

async function startServer() {
  try {
    await connectDB()
    console.log('✅ MongoDB connected')

    await connectRedis()
    console.log('✅ Redis connected')

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  } catch (error) {
    console.error(' Server startup failed:', error)
    process.exit(1)
  }
}

startServer()
