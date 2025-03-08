const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const User = require("../model/Reg");
const nodemailer = require("nodemailer");
const os = require("os");

const Login = asynchandler(async (req, res) => {
    const dev = os.type();
    const osv = os.version();
    const osname = os.hostname();
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const found = await User.findOne({ email }).exec();
    
    if (!found) {
        return res.status(400).json({ message: `${email} does not exist` });
    }

    if (!found.active) {
        return res.status(400).json({ message: `${email} this account is suspended` });
    }

    if (found.email !== email || found.password !== password) {
        return res.status(401).json({ message: "Incorrect Username or Password" });
    }

    const accesstoken = jwt.sign(
        {
            UserInfo: {
                id: found._id,
                username: found.email,
                account: found.account_no,
                update: found.updatedAt,
                password: found.password,
                Roles: found.Roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    );

    const refreshtoken = jwt.sign(
        {
            UserInfo: {
                id: found._id,
                account: found.account_no,
                username: found.email,
                password: found.password,
                update: found.updatedAt,
                Roles: found.Roles
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } 
    );

    console.log(found);

    res.cookie("jwt", refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.User,
            pass: process.env.pass
        }
    });

    await transport.sendMail({
        from: process.env.User,
        to: found.email,
        subject: "Login",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Email</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; }
                .header { background-color: #007BFF; color: white; text-align: center; padding: 20px; font-size: 24px; font-weight: bold; }
                .content { padding: 20px; color: #333; text-align: center; }
                .content h1 { font-size: 28px; margin-bottom: 10px; color: #007BFF; }
                .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
                .footer { background-color: #007BFF; color: white; text-align: center; padding: 10px; font-size: 14px; };
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    KS Bank
                </div>
                <div class="content">
                    <h1>**Security Alert**</h1>
                    <p>Dear ${found.email},</p>
                    <p>Your account has been logged in on another device (${osname} ${osv} ${dev}). 
                    If this was not you, please secure your account immediately.</p>
                    <p><strong>For assistance, contact support: 08134518265</strong></p>
                </div>
                <div class="footer">
                    © 2024 KS Bank. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        `,
    });

    res.status(201).json(accesstoken);
});

module.exports = Login;
