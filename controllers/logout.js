const jwt=require("jsonwebtoken");
const asynchandler=require("express-async-handler");
const User=require("../model/Reg");

const logout=asynchandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.jwt)return res.status(401).json({"message":"Unauthorized"})
    res.clearCookie('jwt',{httpOnly:true,
// sameSite:'none'
sameSite: "Strict",secure:true})
    res.status(201).json({"message":"you logout"})
    
})
module.exports=logout;