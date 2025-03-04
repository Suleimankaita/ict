const jwt =require("jsonwebtoken");
const asynchandler=require("express-async-handler");
const User=require("../model/Reg");

const get=asynchandler(async(req,res)=>{

    const data=await User.find().lean()

    if(data.length){
        res.status(200).json(data)
    }else{
        res.status(404).json({"message":"Empty "})

    }

})

const create=asynchandler(async(req,res)=>{
    const{firstname,lastname,password,username,BVN,state,email,birth,transaction_pin }=req.body
    if(!firstname&&!lastname&&!password&&!username&&!BVN&&!state&&!email&&!birth,!transaction_pin )return res.status(400).json({"message":`all field are required`});

    const found=await User.findOne({email}).exec()
    const lastUser = await User.findOneAndUpdate(
        {}, // Match any document
        { $max: { account_no: 1 } }, // Increment only if userId exists, otherwise start at 1
        { sort: { account_no: -1 }, new: true } // Sort by userId in descending order
      );
  
      const nextUserId = lastUser ? lastUser.account_no+=1 : 2234543321;
    
      const user= await User.findOneAndUpdate(
        {}, // Match any document
        { $max: { UserId: 1 } }, // Increment only if userId exists, otherwise start at 1
        { sort: { UserId: -1 }, new: true } // Sort by userId in descending order
      );
  
      const UserId = user ? user.UserId+=1 : 1;

    if(found)return res.status(409).json({"message":`${username} is already exist`})

        const result=await User.create({
            username,
            password,
            birth,
            state,
            BVN,
            UserId,
            account_no:nextUserId,
            email,
            transaction_pin,
            firstname,
            lastname,

        })

        console.log(result)
        res.status(201).json({'message':`${username} is created`})

})

const delete_user=asynchandler(async(req,res)=>{
    const {id}=req.body
    const found=await User.findByIdAndDelete({_id:id})
    if(!found) return res.status(404).json({"message":`user not found`});
    res.status(201).json({'message':`$user is deleted`})


})

const update=asynchandler(async(req,res)=>{
    const {firstname,lastname,password,username,phone,state,email,birth ,transaction_pin}=req.body
    const found=await User.findOne({_id:req.params.id}).exec()
    if(!found) return res.status(400).json({"message":`user not found`});
    res.status(201).json({'message':`$user is updated`})
     let image
     if(req.file){
         image=req.file.filename
     }
    console.log(email,firstname)

        found.phone=phone
        
        found.transaction_pin=transaction_pin

        found.firstname=firstname

        found.birth=birth

        found.username=username

        found.lastname=lastname

        // found.password=password

        found.state=state

        found.email=email

        if(image){

            found.img=image
        }

        const result=await found.save()
        console.log(result)
    
});

// const addTran=asynchandler(async(req,res)=>{
//     const {amount,addamount,username}=req.body;
    
//     let setamount;
//     if(amount&&!addamount){
//         setamount=-amount
//     }else if(!amount&&addamount){
//         setamount=addamount

//     }

    
//       const user= await User.transaction.findOneAndUpdate(
//         {}, 
//         { $max: { transaction_id: 1 } },  
//         { sort: { transaction_id: -1 }, new: true } 
//       );
  
//       const Trans = user ? user.transaction_id+=1 : 1;

//     // console.log(req.params.id)
//     console.log(username)
//     if(!req.params.id===null)return res.status(400).json({"message":"insuficient found"});
//     if(!setamount)return res.status(400).json({"message":"insuficient found"});

//     const found=await User.findByIdAndUpdate(req.params.id,{"$push":{
//             transaction:[{
//                 amount:setamount,
//                 date:new Date().toISOString().split("T")[0],
//                 time:new Date().toLocaleTimeString(),
//                 transaction_id:Trans,
//                 name:username
//             }]
//     }}
        
//     ).exec();

//     req.io.emit("transactionUpdate", found);
//     req.io.emit("notify", found.transaction.at(-1));

//     console.log(found.transaction.at(-1))
//     if(!found)return res.status(400).json({"message":`User not found ${id}`})

//         res.status(201).json(found)

// })

const addTran = asynchandler(async (req, res) => {
    const { amount, addamount, username } = req.body;
    const id = req.params.id;

    if (!id) return res.status(400).json({ "message": "Insufficient funds" });

    let setamount;
    if (amount && !addamount) {
        setamount = -amount;
    } else if (!amount && addamount) {
        setamount = addamount;
    } else {
        return res.status(400).json({ "message": "Invalid transaction data" });
    }

    const latestTransaction = await User.findOne({}, { transaction: { $slice: -1 } })
        .sort({ "transaction.transaction_id": -1 })
        .lean();

    const lastTransId = latestTransaction?.transaction?.[0]?.transaction_id || 0;
    const newTransId = lastTransId + 1;

    const found = await User.findByIdAndUpdate(
        id,
        {
            "$push": {
                transaction: {
                    amount: setamount,
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toLocaleTimeString(),
                    transaction_id: newTransId,
                    name: username
                }
            }
        },
        { new: true }
    ).exec();

    if (!found) return res.status(400).json({ "message": `User not found: ${id}` });

    req.io.emit("transactionUpdate", found);
    req.io.emit("notify", found.transaction.at(-1));

    res.status(201).json(found);
});

// const addTran2 = asynchandler(async (req, res) => {
//     const { amount, addamount, ids, username, id1 } = req.body;
//     console.log("Transaction ID:", id1);

//     if (!req.params.id) {
//         return res.status(409).json({ "message": "Insufficient funds" });
//     }

//     let setamount;
//     if (amount && !addamount) {
//         setamount = -amount;
//     } else if (!amount && addamount) {
//         setamount = addamount;
//     }

//     if (setamount === undefined) {
//         return res.status(400).json({ "message": "Invalid transaction amount" });
//     }

//     const found = await User.findOne({ account_no: req.params.id }).exec();

//     if (!found) {
//         return res.status(400).json({ "message": `User not found: ${req.params.id}` });
//     }

//     const newTransaction = {
//         amount: setamount,
//         date: new Date().toISOString().split("T")[0],
//         time: new Date().toLocaleTimeString(),
//         id1: id1,
//         name: username
//     };

//     found.transaction.push(newTransaction);
//     await found.save(); // Save the \
//     // updated document

//     // Emit real-time updates
//     req.io.emit("transactionUpdates", found);
//     req.io.emit("notify", newTransaction); // Send only the last transaction

//     console.log("Latest Transaction:", newTransaction);

//     res.status(201).json(newTransaction);
// });

const addTran2 = asynchandler(async (req, res) => {
    const { amount, addamount, ids, username, id1 } = req.body;
    console.log("Transaction ID:", id1);

    if (!req.params.id) {
        return res.status(409).json({ "message": "Insufficient funds" });
    }

    let setamount;
    if (amount && !addamount) {
        setamount = -amount;
    } else if (!amount && addamount) {
        setamount = addamount;
    }

    if (setamount === undefined) {
        return res.status(400).json({ "message": "Invalid transaction amount" });
    }

    const found = await User.findOne({ account_no: req.params.id }).exec();

    if (!found) {
        return res.status(400).json({ "message": `User not found: ${req.params.id}` });
    }

    const lastTransaction = found.transaction.length > 0 ? found.transaction.at(-1) : null;
    const lastTransactionId = lastTransaction ? Number(lastTransaction.transaction_id) : 0;
    const newTransactionId = isNaN(lastTransactionId) ? 1 : lastTransactionId + 1;

    const newTransaction = {
        amount: setamount,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        id1: id1,
        name: username,
        transaction_id: newTransactionId 
    };

    found.transaction.push(newTransaction);
    await found.save(); // Save the updated document

    req.io.emit("transactionUpdates", found);
    req.io.emit("notify", newTransaction); 

    console.log("Latest Transaction:", newTransaction);

    res.status(201).json(newTransaction);
});


const asyncHandler = require('express-async-handler'); 

const seens = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ "message": "Transaction ID not found" });
    }

    const user = await User.findOne({ "transaction._id": req.params.id });

    if (!user) {
        return res.status(404).json({ "message": "Transaction not found" });
    }

    const transaction = user.transaction.find(t => t._id.toString() === req.params.id);

    if (!transaction) {
        return res.status(404).json({ "message": "Transaction not found" });
    }

    transaction.seen = true;

    await user.save();

    res.json({ "message": "Transaction updated successfully", transaction });
});

module.exports={seens,create,update,delete_user,get,addTran,addTran2}