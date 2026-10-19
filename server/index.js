import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import resumeRouter from "./routes/resume.route.js"
import questionsRouter from "./routes/questions.route.js"
import evaluateRouter from "./routes/evaluate.route.js"
import placementRouter from "./routes/placement.route.js"

const app = express()
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175",
    "https://wewithyou.onrender.com",
    "https://WeWithU.onrender.com"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #059669;">wewithyou Backend API</h1>
            <p>The backend services are running successfully on port 8000.</p>
            <p>Please navigate to the frontend app at <a href="http://localhost:5173" style="color: #059669; font-weight: bold; text-decoration: none;">http://localhost:5173</a> to start using the platform.</p>
        </div>
    `);
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/resume", resumeRouter)
app.use("/api/questions", questionsRouter)
app.use("/api/evaluate", evaluateRouter)
app.use("/api/placement", placementRouter)

// "app.use() takes two parameters here. The first parameter (/api/questions) is the base URL or route prefix,
//  and the second parameter (questionsRouter) is the router object that contains all the question-related endpoints.
//   Express combines both to create the complete API path." 🚀

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
