const mongoose=require("mongoose")
const User = require("./user-model")
const {model,Schema}=mongoose

const officeSchema=new Schema({
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title:String,
    address: String,
    location:{
        latitude:Number,
        longitude:Number
    },
    capacity:Number,
    description:String,
    availableAmenities:[{type:Schema.Types.ObjectId,ref:'Amenity'}],
    image:String,
    status:{
        type:String,
        default:"available"},
    adminApproval:{
        type:Boolean,
        default:false
    }

})

const Office= model('Office',officeSchema)

module.exports=Office

//How object is created from constructor function. Is property of a new object determined by the constructor function, or only methods?
//Schema types (https://mongoosejs.com/docs/schematypes.html#uuid)

