const mongoose= require("mongoose")
const {model,Schema}=mongoose
console.log(model)
const userSchema = new Schema({
    username: String,
    email: String,
    password:String,
    role:String
},{timestamps:true})

const User= model('User',userSchema)

module.exports=User


