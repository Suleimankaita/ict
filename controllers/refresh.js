
//     const jwt=require("jsonwebtoken")
//     const User=require("../model/Reg")
//     const asynchandler=require("express-async-handler")

//     const refresh=asynchandler( async(req,res)=>{
//         const cookies=req.cookies
//         if(!req.cookies?.jwt) return res.status(403)
//             const token=cookies.jwt
        
//         jwt.verify(
//             token,
//             process.env.REFRESH_TOKEN_SECRET,
//            asynchandler(async (err,decode)=>{
//                 console.log(decode)
//                     if(err) return res.sendStatus(403)
//                 const accesstoken=jwt.sign(
//                     {
//                         "UserInfo":{
//                             "id":decode.UserInfo.id,
//                             "account":decode.UserInfo.account,
//                             "username":decode.UserInfo.username,
//                             "password":decode.UserInfo.password,
//                             "Roles":decode.UserInfo.Roles,
//                             "update":decode.UserInfo.update,

//                         },  
//                     },
//                     process.env.ACCESS_TOKEN_SECRET,
//                     {expiresIn:"10m"}
//             )
//             res.status(201).json(accesstoken)
//             }))
        
        
//     })




// module.exports=refresh;

const jwt = require("jsonwebtoken");
const User = require("../model/Reg");
const asynchandler = require("express-async-handler");

const refresh = asynchandler(async (req, res) => {
    const cookies = req.cookies;

    // ✅ Fix: Return JSON response if no refresh token is found
    if (!cookies?.jwt) {
        return res.status(403).json({ message: "No refresh token found" });
    }

    const token = cookies.jwt;

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
        if (err) {
            return res.sendStatus(403);
        }

        console.log(decode);

        const accesstoken = jwt.sign(
            {
                "UserInfo": {
                    "id": decode.UserInfo.id,
                    "account": decode.UserInfo.account,
                    "username": decode.UserInfo.username,
                    "password": decode.UserInfo.password,
                    "Roles": decode.UserInfo.Roles,
                    "update": decode.UserInfo.update,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
        );

        res.status(201).json(accesstoken);
    });
});

module.exports = refresh;
