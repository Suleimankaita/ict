const User=require("../model/Reg")
const asynchandler=require("express-async-handler");
const nodemailer=require('nodemailer')
const forget=asynchandler(async(req,res)=>{

    const {email}=req.body;
    if(!email)return res.status(400).json({'message':"this field is required"})
    
        const found=await User.findOne({email}).exec()

        if(!found)return res.status(401).json({'message':"this gmail account is not exist on our Data"});

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
            subject:"Reset Password",
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
            button{
            border: none;
            cursor: pointer;
             background-color: #00c8ff;
             width:100px;
             height:30px;
             border-radius: 10px;
             color:whitesmoke;

            }
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
            <div>
                <p>
           Dear ${found.email}  
               For security reasons, we cannot divrovide your old password. However, we can send you a link to reset your password. Please click the link below to create a new </p>password: <a href=https://ks-bank-8g91.onrender.com/reset/${found._id}><button>reset</button></a>
                
                For assistance, contact support.<tel>08134518265</tel></div>
        </div>
        <div class="footer">
            © 2024 KS Bank. All rights reserved.
        </div>
    </div>
</body>
</html>
            `
           })
        
       res.status(201).json({"message":"you will receive a  reset password link on your gmail account"})

        
})
module.exports=forget