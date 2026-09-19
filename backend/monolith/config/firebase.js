import { cert, initializeApp } from "firebase-admin"
import { createRequire } from "module"

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
    const require = createRequire(import.meta.url);
    serviceAccount = require("../serviceAccountKey.json");
}

export const app = initializeApp({
    credential: cert(serviceAccount)
})
