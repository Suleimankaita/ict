const mongoose=require('mongoose');
const asynchandler=require("express-async-handler")
const connect=asynchandler(async()=>{

    await mongoose.connect(process.env.DATA_URI)

})
module.exports=connect