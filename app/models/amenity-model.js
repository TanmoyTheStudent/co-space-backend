const mongoose=require("mongoose")
const {Schema,model}=mongoose

const amenitySchema= new Schema({
    title:String,
    charge:Number
},{timestamps:true})

const Amenity=model("Amenity",amenitySchema)

module.exports=Amenity


// ## Amenities model
// -- Title: "string"
// -- Charge: Number