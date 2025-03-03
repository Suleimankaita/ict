const mongoose=require("mongoose");

const requestSchema=new mongoose.Schema({
    
    username:{
        type:String,
        required:true
    },
    
    account_no:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    
    id:{
        type:String,
        required:true
    },
    
    time:{
        type:String,
        required:true
    },
    
  
})
module.exports=mongoose.model("Request",requestSchema);