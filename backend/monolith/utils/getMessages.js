import Message from "../models/message.model.js"

// Direct DB lookup — no HTTP call to chat service
export const getMessages = async (conversationId) => {
    try {
        const messages = await Message.find({ conversationId }).lean()
        return messages.map(m => ({ role: m.role, content: m.content }))
    } catch (error) {
        console.log(error)
        return []
    }
}
