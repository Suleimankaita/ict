const mongoose=require("mongoose");

const Paybill=new mongoose.Schema({
    
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
    billname:String
    
  
})
module.exports=mongoose.model("Paybill",Paybill);