const jwt=require("jsonwebtoken");
const asynchandler=require("express-async-handler");
const User=require("../model/Reg");
const nodemailer=require("nodemailer")
const os=require('os')
const Login=asynchandler(async(req,res)=>{
    const dev=os.type()
    const osv=os.version()
    const osname=os.hostname()
    const {email,username,password}=req.body;
    if(!email&&!password)return res.status(400).json({message:"all field are required"});

    const found=await User.findOne({email}).exec()
   
    if(found.email!==email||found.password!==password){
        return res.status(401).json({"message":"Incorrect Username or Password"})
}
 
    if(!found) {
        return res.status(400).json({'message':`${email} is not exist`})};
    if(!found.active) return res.status(400).json({'message':`${email} this account is suspendend`});


    
    if(found.email===email&&found.password===password){
       
   
        const accesstoken=jwt.sign(
            {
                "UserInfo":{
                "id":found._id,
                "username":found.email,
                "account":found.account_no,
                "update":found.updatedAt,
                 "password":found.password,
                "Roles":found.Roles}
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"10m"},   
        )
        const refreshtoken=jwt.sign(
            {
                "UserInfo":{
                "id":found._id,
                "account":found.account_no,
                "username":found.email,
                "password":found.password,
                "update":found.updatedAt,
                "Roles":found.Roles
            }
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"7d"},   
        )
    console.log(found)

        res.cookie('jwt',refreshtoken,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000})


            const transport= nodemailer.createTransport({
                service: 'gmail',
             
             // secure:true,
             auth:{
                 user:process.env.User,
                 pass:process.env.pass,
             }
            })
     
           
            await transport.sendMail({
             from:process.env.User,
             to:found.email,
             subject:"Login",
             html:`
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
        tel{

        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            KS Bank
        </div>
        <div class="content">
            <h1>**Security Alert**</h1>
            <div>
        <p>   Dear ${found.email}  
                Your account has been logged in on another device ${osname} ${osv} ${dev} If this was not you, please secure your account immediately by changing your password and enabling two-factor authentication.  
            </p>
               <span> For assistance contact support</span> <tel>08134518265</tel></div>
        </div>
        <div class="footer">
            © 2024 KS Bank. All rights reserved.
        </div>
    </div>
</body>
</html>
             `
            })
            

        res.status(201).json(accesstoken)
    }

})

module.exports=Login