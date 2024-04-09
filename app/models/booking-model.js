const mongoose=require("mongoose")
const {model,Schema}=mongoose

const bookingSchema=new Schema({

    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    office: {
        type:Schema.Types.ObjectId,
        ref:'Office'
    },
    spaces:[{
        space:{type:Schema.Types.ObjectId,ref:'Space'},
        quantity:Number
    }],
    extraAminities:[{type:Schema.Types.ObjectId,ref:'Amenity'}],
    totalAmount:Number,
    status:{
        type:String,
        default:"Pending"
    }
    
})
    
})

const Booking= model('Booking',bookingSchema)

module.exports=Booking


// --userId
//   --spaceId
//   --spaceTypeId 
//   --propertyId
//   --quantity
//   --Extra aminities:[aminities ObjectId]
//   --TotalAmount
//   --status-["booked","pending"]
