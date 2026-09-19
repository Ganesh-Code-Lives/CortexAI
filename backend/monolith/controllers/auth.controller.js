import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import redis from "../config/redis.js"

export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()
        await redis.set(`user-session-${user?._id}`,
            sessionId,
            "EX", 7 * 24 * 60 * 60)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        await redis.del(`session-${sessionId}`)

        res.clearCookie("session")
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}

export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body
        await updateUserPaymentInternal(userId, plan, credits)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ message: `update user payment error ${error}` })
    }
}

// Internal version — called directly by billing controller without HTTP
export const updateUserPaymentInternal = async (userId, plan, credits) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new Error("User not found")
    }
    user.plan = plan
    user.credits += credits
    user.totalCredits += credits
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await user.save()

    const sessionId = await redis.get(`user-session-${user?._id}`)
    await redis.set(`session-${sessionId}`, JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt
    }), "EX", 7 * 24 * 60 * 60)
}

export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body
        const result = await deductCreditsInternal(userId, agent)
        return res.status(200).json(result)
    } catch (error) {
        if (error.message === "user not found") {
            return res.status(400).json({ message: "user not found" })
        }
        if (error.message === "Not enough credits.") {
            return res.status(400).json({ message: "Not enough credits." })
        }
        return res.status(500).json({ message: `deduct credits error ${error}` })
    }
}

// Internal version — called directly by agent without HTTP
export const deductCreditsInternal = async (userId, agent) => {
    const COST = {
        chat: 1,
        search: 5,
        coding: 10,
        pdf: 10,
        ppt: 10,
        vision: 10
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new Error("user not found")
    }

    const requiredCredits = COST[agent] || 1
    if (user.credits < requiredCredits) {
        throw new Error("Not enough credits.")
    }
    user.credits -= requiredCredits
    await user.save()

    const sessionId = await redis.get(`user-session-${user?._id}`)
    await redis.set(`session-${sessionId}`, JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt
    }), "EX", 7 * 24 * 60 * 60)

    return { success: true, credits: user.credits }
}
