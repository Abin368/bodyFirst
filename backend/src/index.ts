import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoutes";
import helmet from 'helmet' 
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000
app.use(helmet())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: "Too many requests, please try again later."
}));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running 🚀')
})

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});