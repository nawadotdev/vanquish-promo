import { startClient } from "./lib/client.js";
import { connectDB } from "./lib/db.js";

connectDB().then(() => {
    startClient()
})