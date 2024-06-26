const mongoose=require("mongoose")
const {model,Schema}=mongoose

const reviewSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    space:Schema.Types.ObjectId,
    rating:Number,
    review:String
    
},{timestamps:true})

const Review=model('Review',reviewSchema)

module.exports=Review

// ## Review
// customerId
// propertyId
// rating
// review 

// const reviewSchema = new Schema ({
//     userId: {
//         type:Schema.Types.userId,
//         ref:'User'
//     },
//     officeId: {
//         type:Schema.Types.officeId,
//         ref: 'Office'
//     },
//     rating: Number,
//     review: String
// })