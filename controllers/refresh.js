
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

    if (!cookies?.jwt) {
        return res.status(403).json({ message: "No refresh token found" });
    }

    const token = cookies.jwt;

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        console.log("Decoded Refresh Token:", decoded);

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    id: decoded.UserInfo.id,
                    account: decoded.UserInfo.account,
                    username: decoded.UserInfo.username,
                    Roles: decoded.UserInfo.Roles,
                    update: decoded.UserInfo.update,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
        );

        res.status(200).json({ accessToken });
    });
});

module.exports = refresh;
