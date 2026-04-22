/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import paintingRoutes from './routes/painting.js'
import { globalLimiter, loginLimiter } from './middleware/rateLimit.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(globalLimiter)

/**
 * API Routes
 */
app.use('/api/auth', loginLimiter, authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/painting', paintingRoutes)
// Compatibility routes for environments where a proxy strips the /api prefix.
app.use('/auth', authRoutes)
app.use('/chat', chatRoutes)
app.use('/painting', paintingRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)
app.use(
  '/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * Serve static files in production
 */
app.use(express.static(path.join(__dirname, '../dist')))

/**
 * 404 handler for API, SPA fallback for others
 */
app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      error: 'API not found',
    })
  } else {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  }
})

export default app
