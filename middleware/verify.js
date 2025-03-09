// const jwt=require("jsonwebtoken");
// const asynchandler=require("express-async-handler");

// const verify=asynchandler(async(req,res,next)=>{

//     const auth=req.headers.authorization||req.headers.Authorization
//     if(!auth.startsWith('Berear '))return res.status(403).json({message:"not verify"})
//      const token=auth.split(' ')[1]

//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET,
//         (err,decode)=>{
//             if(err)return res.status(403).json({message:"forbidden"})
//             req.username=decode.userInfo.username
//             req.password=decode.userInfo.password
//             next()
//         }
//     )
        
// })

// module.exports=verify
const asynchandler=require("express-async-handler");
const jwt=require("jsonwebtoken")

const verify=(req,res,next)=>{
    
    const auth=req.headers.authorization||req.headers.Authorization

    if(!auth?.startsWith("Bearer "))return res.sendStatus(403)

    const token=auth.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        asynchandler(async(err,decode)=>{
            if(err) return res.sendStatus(403);
            req.username=decode.UserInfo.username
            // req.Roles=decode.Roles
            req.password=decode.UserInfo.password
            next()
        })   
    )

}

module.exports=verify