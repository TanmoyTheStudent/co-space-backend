const mongoose=require("mongoose")
const {model,Schema}=mongoose

const amenitySchema= new Schema({
    amenityName:String,
    amenityCharge:[{
        option:String,
        price:Number
    }]
    
},{timestamps:true})

const Amenity=model('Amenity',amenitySchema)

module.exports=Amenity


// ## Amenities model
// -- Title: "string"
// -- Charge: Number