import "dotenv/config"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"

let groq
let gemini
let openrouter

export const getModel = async (agent) => {
    switch (agent) {
        case "coding":
            if (!openrouter) {
                openrouter = new ChatOpenRouter({
                    model: "deepseek/deepseek-chat",
                    temperature: 0,
                    maxTokens: 2500
                })
            }
            return openrouter
        case "imageAnalyzer":
            if (!gemini) {
                gemini = new ChatGoogleGenerativeAI({
                    model: "gemini-2.5-flash"
                })
            }
            return gemini
        case "chat":
        case "search":
        default:
            if (!groq) {
                groq = new ChatGroq({
                    model: "openai/gpt-oss-120b"
                })
            }
            return groq
    }
}

