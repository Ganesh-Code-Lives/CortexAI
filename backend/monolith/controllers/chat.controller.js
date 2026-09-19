import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversation = async (req, res) => {
    try {
        const userId = req.user.userId
        const conversation = await Conversation.create({ userId })
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `create conversation error ${error}` })
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.user.userId
        const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 })
        return res.status(200).json(conversations)
    } catch (error) {
        return res.status(500).json({ message: `get conversation error ${error}` })
    }
}

export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body
        const conversation = await Conversation.findByIdAndUpdate(id, { title })
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `update conversation error ${error}` })
    }
}

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, images, artifacts } = req.body
        const message = await saveMessageInternal(conversationId, role, content, images, artifacts)
        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ message: `save message error ${error}` })
    }
}

// Internal version — called directly by agent controller without HTTP
export const saveMessageInternal = async (conversationId, role, content, images, artifacts) => {
    return await Message.create({ conversationId, content, role, images, artifacts })
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: `get messages error ${error}` })
    }
}

// Internal version — called directly by agent memory config without HTTP
export const getMessagesInternal = async (conversationId) => {
    return await Message.find({ conversationId }).lean()
}
