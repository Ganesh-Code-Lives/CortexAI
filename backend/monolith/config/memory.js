import redis from "./redis.js"
import Message from "../models/message.model.js"

export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`
    const cached = await redis.get(key)
    if (cached) {
        return JSON.parse(cached)
    }

    // Direct DB lookup — no HTTP call needed in the monolith
    const messages = await Message.find({ conversationId }).lean()
    const formatted = messages.map(m => ({ role: m.role, content: m.content }))
    await redis.set(key, JSON.stringify(formatted), "EX", 24 * 60 * 60)

    return formatted
}

export const addMessage = async (conversationId, role, content) => {
    const key = `messages-${conversationId}`
    const rawMessages = await redis.get(key)
    const messages = rawMessages ? JSON.parse(rawMessages) : []
    messages.push({ role, content })

    if (messages.length > 20) {
        messages.shift()
    }

    await redis.set(key, JSON.stringify(messages))
}
