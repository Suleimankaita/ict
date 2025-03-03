const Loan=require("../model/Reg");
const asyncHandler=require("express-async-handler")



const getloan=asyncHandler(async(req,res)=>{
    const data=await Loan.find().lean()
    if(!data.length){
        res.status(400).json({"message":"Empty Loan Request"})
    }
    res.status(200).json(data)
})

const loan=asyncHandler(async(req,res)=>{

    const {username,account_no,id,amount}=req.body;
    
    console.log(account_no)

    if(!username&&!account_no&&!id,!amount) return res.status(400).json({'message':"wroung parameter"})
        

 const found=await Loan.findByIdAndUpdate({_id:id},{"$push":{
            Loan:{
                username,
                account_no,
                id,
                amount,
                date:new Date().toISOString().split("T")[0],
                time:new Date().toLocaleTimeString()
            }

        }})

        console.log(found)
    // const result =await Loan.create(
    //     {
    //         username,
    //         account_no,
    //         id,
    //         time:new Date().toLocaleTimeString(),
    //         date:new Date().toISOString().split("T")[0],
    //         amount
    //     }
    // )    
    // console.log(result)

    res.status(201).json({"message":found})
        

})

module.exports={loan,getloan}