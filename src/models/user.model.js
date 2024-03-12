import mongoose from "mongoose";

const commonSchema = mongoose.Schema({
   
    referralCode:{
        type:String,
     
    },
    INR:{
        type:Number,
        default:0
    },
    isReferred:{
        type:Boolean,
        default:false
    },
    isReferUsed:{
        type:Boolean,
        default:false
    },
    referedCount:{type:Number,default:0},
   coins:{
        type:Number,
        default:0
    },
    movecount:{
        type:Number,
        default:5
    },
    highestScore:{
        type:Number,
        default:0
    },
    ruby:{
        type: Number,
        default:0
    },
    vehiclePower:{
        type: Number,
        default:0
    },
    
    achievements:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"achievement"
         
        }
    ],
  
    levels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'level'
        }
    ]
},{timestamps:true}
)
const guestSchema = new mongoose.Schema({
    deviceID:{
        type:String,
        unique:true,
        required:true
    }
})
const authSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
        
    }
})
const facebookSchema = new mongoose.Schema({
    facebookID:{
        type:String,
        unique:true
       
    },
   
})

export const userModel = mongoose.model('user', commonSchema);
export const facebookModel = userModel.discriminator('facebookPlayer',facebookSchema);
export  const guestModel = userModel.discriminator('guestPlayer', guestSchema);
export const authModel = userModel.discriminator('authPlayer', authSchema);