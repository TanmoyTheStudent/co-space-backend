const mongoose=require("mongoose")
const User = require("./user-model")
const {model,Schema}=mongoose

const spaceSchema=new Schema({
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
    totalQuantity:Number,
    bookedQuantity:Number,
    freeAminities:[{type:Schema.Types.ObjectId,ref:'Amenity'}],
    rating:Number
    
})

const Space= model('Space',spaceSchema)

module.exports=Space



// ## space model
//   --officeId:schema.type.ObjectId
//   --categoryId: schema.type.ObjectId
//   --type:[{ name: 'daily', price: '' }{ name: 'monthly', price: '' }]
//   --Available quantity
//   --isOccupied:[available,occupied]
//   --rating
//   --Free aminities:[aminities ObjectId]
//   --image

//** isOccupied can be calculated from available quantity
