const written=require("./write_node");
const asynchandler=require("express-async-handler");

const errors=asynchandler(async(err,req,res,next,error)=>{
    const message=`${err.name}\t${err.message}\t${req.originalUrl}\t${req.origins}\t${req.headers}\t ${req.ip}\n`
    written(message,'error_loger.log')
    next()
})
module.exports=errors
