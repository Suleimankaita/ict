const written=require("./write_node");
const asynchandler=require("express-async-handler");

const details=asynchandler(async(req,res,next)=>{
    const message=`${req.originalUrl}\t${req.origins}\t${req.method}\t${req.headers}\t ${req.ip}\n`
    written(message,'loger.log')
    next()
})
module.exports=details
