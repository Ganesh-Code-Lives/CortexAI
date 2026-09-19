import { deductCreditsInternal } from "../controllers/auth.controller.js"

// Direct function call — no HTTP call to auth service
export const deductCredits = async (userId, agent) => {
    try {
        const data = await deductCreditsInternal(userId, agent)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
