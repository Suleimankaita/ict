require('dotenv').config();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const connect = require("./config/connect_mongo");
const User = require("./model/Reg");
const opt=require("./config/config")
const app = express();
const Port = process.env.PORT || 4000;
const multer=require("multer")
const nodemailer=require("nodemailer")
connect();
const os=require('os')

console.log(os.type(),os.hostname(),os.version())



// async function sendEmail() {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: "suleiman20015kaita@gmail.com", // Set in .env file
//                 pass:'rsmq mufs ycsa fhad' // Use App Password
//             }
//         });

//         const info = await transporter.sendMail({
//             from: "suleiman20015kaita@gmail.com",
//             to: "suleiman76kaita@gmail.com",
//             subject: "Ks Bank",
//             html: `
// //              <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1">
//             <title>Email</title>
//             <style>
//                 body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
//                 .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px;
//                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; }
//                 .header { background-color: #007BFF; color: white; text-align: center; padding: 20px; font-size: 24px; font-weight: bold; }
//                 .content { padding: 20px; color: #333; text-align: center; }
//                 .content h1 { font-size: 28px; margin-bottom: 10px; color: #007BFF; }
//                 .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
//                 .footer { background-color: #007BFF; color: white; text-align: center; padding: 10px; font-size: 14px; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     KS Bank
//                 </div>
//                 <div class="content">
//                     <h1>Suleiman</h1>
//                     <p>Nine Manu Kaita</p>
//                 </div>
//                 <div class="footer">
//                     © 2024 KS Bank. All rights reserved.
//                 </div>
//             </div>
//         </body>
//         </html>
//             `
//         });

//         console.log('Email sent successfully:', info.messageId);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// }

// sendEmail();


app.use(cors(opt));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"public" ,'image'))
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+ path.extname(file.originalname))
    }
})

const upload=multer({storage:storage})

app.use('/', require('./routes/root'));

app.use('/registration', require('./routes/regs'));

app.use('/Update',upload.single('file'), require('./routes/Update'));

app.use('/get', require('./routes/get'));

app.use('/auth', require('./routes/auth')); 

app.use('/Logout', require('./routes/Logout')); 

app.use('/delete', require('./routes/delete')); 

app.use('/paybill', require('./routes/paybill')); 

app.use('/Loan', require('./routes/Loan')); 

app.use('/forget', require('./routes/forget')); 

app.use('/reset', require('./routes/reset')); 


app.use('/refresh', require('./routes/refresh'));

mongoose.connection.once('open', () => {
    console.log("Connected to DB");

    const server = app.listen(Port,"0.0.0.0", () => console.log("Listening on " + Port));

    const io = new Server(server, {
        cors: { origin: ["http://localhost:5173","http://172.20.10.3:5173"], methods: ["GET", "POST"] }
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
