// const jwt=require("jsonwebtoken");
// const asynchandler=require("express-async-handler");
// const User=require("../model/Reg");

// const refresh=(req,res)=>{
//     const cookie=req.cookies;
//     // console.log('man'+cookie.jwt)
//     if(!cookie?.jwt) return res.status(401).json({"message":"unothorizeds"});

//         const token=cookie.jwt
//     // console.log(req.cookies)
//     console.log('man'+req.cookies.jwt)

//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET,

//         asynchandler(async(err,decode)=>{
            
//             console.log(decode,err)
//             if(err) return res.status(403).json({"message":"Unauthorizeds"});
//             // const found=await User.findOne({username:decode.username}).exec().lean()
//             // if(!found?.active) return res.status(403).json({"message":`${decode.username} is suspendend`});
//             const accesstoken=jwt.sign(
//                 {
//                     "username":decode.UserInfo.username,
//                     "password":decode.UserInfo.password,
//                     "Roles":decode.UserInfo.Roles
//                 },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 {expiresIn:'10m'}
//             )
//             res.status(201).json({accesstoken})
//         })
//     )   
// }

    const jwt=require("jsonwebtoken")
    const User=require("../model/Reg")
    const asynchandler=require("express-async-handler")

    const refresh=asynchandler( async(req,res)=>{
        const cookies=req.cookies
        if(!req.cookies?.jwt) return res.status(403)
            const token=cookies.jwt
        
        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET,
           asynchandler(async (err,decode)=>{
                console.log(decode)
                    if(err) return res.sendStatus(403)
                const accesstoken=jwt.sign(
                    {
                        "UserInfo":{
                            "id":decode.UserInfo.id,
                            "account":decode.UserInfo.account,
                            "username":decode.UserInfo.username,
                            "password":decode.UserInfo.password,
                            "Roles":decode.UserInfo.Roles,
                            "update":decode.UserInfo.update,

                        },  
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:"10m"}
            )
            res.status(201).json(accesstoken)
            }))
        
        
    })




module.exports=refresh;