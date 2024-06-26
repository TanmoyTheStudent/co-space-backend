const mongoose= require("mongoose")
const {model,Schema}=mongoose
console.log(model)
const userSchema = new Schema({
    username: String,
    email: String,
    password:String,
    role:{
        type:String
    }
},{timestamps:true})

const User= model('User',userSchema)

module.exports=User


//object destructure
//hof
//pure-impure function
//spread operator
//deep copy-shallow copy
//dafault value of a function
//prototype,constructor function
//import-export-what mongoose offers
//field-collection
//ODM
//data type vs data structure
//mongodb vs mongoose
//creating schema
//how to do mongoose validation (it will work during saving the data in database, but we want to check the data as in middleware)

//** role--> 1st role will be by default a admin and others will be users. Now when some guy/company upload/apply for a property for the first time, he/it will be included "owner" role by the admin when admin accept the request.