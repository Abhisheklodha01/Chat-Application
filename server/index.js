import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.get('/', (req, res) => {
    res.send("working fine")
})

const secret = "abhisedssfksnskfsnfskfnfl"
app.get('/login', (req, res) => {
    const token = jwt.sign({ _id: "abhishek"}, secret)
    res.cookie("token", token, { httpOnly: false, secure: true, sameSite: 'none' }).json({
        message: "logged in successfully"
    })
})

io.use((socket, next) => {
   cookieParser()(socket.request, socket.request.res, (err) => {
         if(err) return next(err)

         const token = socket.request.cookies.token

         if(!token) return next(new Error("authentication failed"))
         const decoded = jwt.verify(token, secret)
        next()
    })
})

io.on('connection', (socket) => {
    console.log("User connected");
    console.log(("ID", socket.id));

    socket.on("message", ({ room, message }) => {
        io.to(room).emit("receive-message", message)
    })

    socket.on("join-room", (room) => {
        socket.join(room)
    })

    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
    })
})


app.use(cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true
}))



const port = 4000
server.listen(port, () => {
    console.log(`Server is running on : port ${port}`);
})