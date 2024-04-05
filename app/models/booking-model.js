const mongoose=require("mongoose")
const User = require("./user-model")
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
    
    category: {
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    image:String,
    bookingType:[{
            option:String,
            price:Number
            }],
    available:Number,
    freeAminities:[{type:Schema.Types.ObjectId,ref:'Amenity'}],
    rating:Number
    
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