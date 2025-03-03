const Paybill=require("../model/Reg");
const asyncHandler=require("express-async-handler")



const getbill=asyncHandler(async(req,res)=>{
    const data=await Paybill.find().lean()
    if(!data.length){
        res.status(400).json({"message":"Empty Bill"})
    }
    res.status(200).json(data)
})

const bill=asyncHandler(async(req,res)=>{

    const {username,account_no,id,amount,billname}=req.body;
    if(!username&&!account_no&&!id&&!amount&&!billname) return res.status(401).json({'message':"wroung parameter"})
        
        const found=await Paybill.findByIdAndUpdate({_id:id},{"$push":{
            bills:{

                username,
                account_no,
                id,
                amount,
                billname,
                date:new Date().toISOString().split("T")[0],
                time:new Date().toLocaleTimeString()
            }

        }})

        console.log(found)
    // const result =await Paybill.create(
    //     {
    //         username,
    //         account_no,
    //         id,
    //         amount,
    //         billname,
    //         date:new Date().toISOString().split("T")[0],
    //         time:new Date().toLocaleTimeString()

    //     }
    // )    
    // console.log(result)

    res.status(201).json({"message":found})
        

})

module.exports={bill,getbill}