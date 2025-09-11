import 'reflect-metadata'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes'
import { connectDB } from './config/db'
import { connectRedis } from './config/redis'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  })
)


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
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

  if (noCachePaths.some(path => req.path.includes(path))) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Surrogate-Control', 'no-store')
  }

  next()
})


app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running ')
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
