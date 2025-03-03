const mongoose=require('mongoose');

const reg_shecma=new mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    transaction_pin:{
        type:String,
    },
    phone:{
        type:String,
    },
    state:{
        type:String,
    },
    email:{
        type:String,
    },

    img:String,
    transaction:[{
        date:String,
        amount:Number,
        transaction_id:Number,
        time:String,

        status:{
            type:String,
            default:"successful"
        },
        types:{
            type:String,
            default:"Credit"
        },
        seen:{
            type:Boolean,
            default:false
        },
        id1:String,
        name:String,
    }],
    BVN:{
        type:Number,
        // required:true,
    },
    birth:{
        type:Number,
        // required:true,
    },
    account_no:{
      type: Number,
    //   required: true,
    //   default: 2234543321, 
    },
    UserId:{
      type: Number,
    //   required: true,
    //   default: 2234543321, 
    },
    Roles:{
        type:Array,
        default:"User"
    },
    active:{
        type:Boolean,
        default:true
    },
    bills:[{
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
        
      
    }],
    Loan:[{
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
        },}
       
    ],
},
{timestamps:true}
)

module.exports=mongoose.model('registration',reg_shecma);