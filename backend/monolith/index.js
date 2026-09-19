import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import connectDb from "./config/db.js"
import protect from "./middleware/auth.middleware.js"

import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import agentRoutes from "./routes/agent.routes.js"
import billingRoutes from "./routes/billing.routes.js"

import { getCurrentUser } from "./controllers/user.controller.js"

const port = process.env.PORT || 3000
const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())

// Public routes
app.use("/api/auth", authRoutes)

// Protected routes
app.use("/api/chat", protect, chatRoutes)
app.use("/api/agent", protect, agentRoutes)
app.use("/api/billing", protect, billingRoutes)
app.get("/api/me", protect, getCurrentUser)

// Health check
app.get("/", (req, res) => {
    res.json({ message: "CortexAI monolith server running" })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error(err)
    if (err.status) {
        return res.status(err.status).json(err.data)
    }
    return res.status(500).json({ message: `Server error: ${err.message}` })
})

app.listen(port, () => {
    console.log(`CortexAI server started at port ${port}`)
    connectDb()
})
