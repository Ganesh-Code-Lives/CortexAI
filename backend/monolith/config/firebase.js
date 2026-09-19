import { cert, initializeApp } from "firebase-admin"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const serviceAccount = require("../serviceAccountKey.json")

export const app = initializeApp({
    credential: cert(serviceAccount)
})
