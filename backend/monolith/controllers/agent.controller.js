import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import { saveMessageInternal } from "./chat.controller.js"
import { deductCreditsInternal } from "./auth.controller.js"

export const agent = async (req, res, next) => {
    try {
        const { prompt, conversationId, agent } = req.body
        const file = req.file
        const userId = req.user.userId

        // Save user message directly (no HTTP call)
        await saveMessageInternal(conversationId, "user", prompt)

        const result = await graph.invoke({
            prompt, conversationId, agent, userId, file
        })

        await addMessage(conversationId, "user", prompt)
        await addMessage(conversationId, "assistant", result.aiResponse)

        // Save assistant message directly (no HTTP call)
        await saveMessageInternal(
            conversationId,
            "assistant",
            result?.aiResponse,
            result?.images,
            result?.artifacts
        )

        return res.status(200).json({
            answer: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts
        })

    } catch (error) {
        next(error)
    }
}
