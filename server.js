require('dotenv').config();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const connect = require("./config/connect_mongo");
const User = require("./model/Reg");
const opt = require("./config/config");
const app = express();
const Port = process.env.PORT || 4000;
const multer = require("multer");
const nodemailer = require("nodemailer");
connect();
const os = require('os');
const fs = require('fs');
// const sshKey = fs.readFileSync(path.join(__dirname, 'config', 'ssh_key.pub'), 'utf8').replace(/\r?\n|\r/g, '');

console.log(os.type(), os.hostname(), os.version());

const allowedOrigins = [
    "http://localhost:5173",
    "http://172.20.10.3:5173",
    "https://KS_banks.onrender.com",
    "https://ks-banks-7cpz.onrender.com",
    "https://man-react-suleimankaitas-projects.vercel.app",
    "https://man-react.vercel.app",
    "https://ks-bank-tskd.onrender.com",
    "https://man-react.vercel.app/",
    "https://man-react-ujy2.vercel.app",
    "https://man-reacts.vercel.app",
    "https://ks-bank-8g91.onrender.com",
    "https://man-react-ujy2-9u7bw6kj1-suleimankaitas-projects.vercel.app"
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    optionsSuccessStatus: 200, // ✅ Prevents CORS errors in older browsers

        allowedHeaders: ["Content-Type", "authorization", "Expires", "Cache-Control", "Pragma"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH" ,"OPTIONS"]
    })
);

// ✅ Handle Preflight Requests
app.options("*", (req, res) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", true);
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Expires, Cache-Control, Pragma");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        // ✅ Prevent iOS Caching Issues
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", "0");
        return res.sendStatus(200);
    }
    return res.sendStatus(403);
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public", 'image'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use('/', require('./routes/root'));
app.use('/registration', require('./routes/regs'));
app.use('/Update', upload.single('file'), require('./routes/Update'));
app.use('/get', require('./routes/get'));
app.use('/auth', require('./routes/auth'));
app.use('/Logout', require('./routes/Logout'));
app.use('/delete', require('./routes/delete'));
app.use('/paybill', require('./routes/paybill'));
app.use('/Loan', require('./routes/Loan'));
app.use('/forget', require('./routes/forget'));
app.use('/reset', require('./routes/reset'));

app.use('/refresh', (req, res, next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    // ✅ Allow cookies to be sent with the request
    res.header("Access-Control-Allow-Credentials", "true");
    // ✅ Add SSH key to response headers
    // res.header("X-SSH-Key", sshKey);
    next();
}, require('./routes/refresh'));

mongoose.connection.once('open', () => {
    console.log("Connected to DB");

    const server = app.listen(Port, () => console.log("Listening on " + Port));

    const io = new Server(server, {
        cors: { origin: ["http://localhost:5173","https://ks-bank-8g91.onrender.com","https://man-reacts.vercel.app","https://man-react-ujy2.vercel.app", "http://172.20.10.3:5173", "https://KS_banks.onrender.com","https://man-react.vercel.app","https://man-react-suleimankaitas-projects.vercel.app","https://man-react.vercel.app/", "https://ks-banks-7cpz.onrender.com","https://ks-bank-tskd.onrender.com","https://man-react-ujy2-5hgpk5ftr-suleimankaitas-projects.vercel.app/","https://man-react-ujy2-9u7bw6kj1-suleimankaitas-projects.vercel.app"], methods: ["GET", "POST"] }
    });

    const connectedClients = new Set();

    io.on("connection", async (socket) => {
        console.log("Client connected:", socket.id);
        connectedClients.add(socket.id);

        const users = await User.find().select("-password");

        socket.emit("message", users);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            connectedClients.delete(socket.id);
        });
    });

    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    app.use('/Tran', require('./routes/tra'));
    app.use('/Tran2', require('./routes/ts'));

    app.all('*', (req, res) => {
        res.status(404);
        if (req.accepts("html")) {
            res.sendFile(path.join(__dirname, "view", "index.html"));
        } else if (req.accepts("json")) {
            res.sendFile(path.join(__dirname, "view", "404.html"));
        }
    });
});
