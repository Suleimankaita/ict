
const User=require("../model/Reg")
const asynchandler=require("express-async-handler");

const reset=asynchandler(async(req,res)=>{

     const {password}=req.body;

     console.log(req.params.id,req.body)

     if(!password) return res.status(400).json({"message":"this field can not be blank"})
    
    
        const found=await User.findOne({_id:req.params.id}).exec()

        if(!found)return res.status(401).json({'message':"UserId not found"});

    
            found.password=password;
            const sav=found.save()
            console.log(sav)
             res.status(201).json({"message":"password is updated"}) 
        

        
})
module.exports=reset

