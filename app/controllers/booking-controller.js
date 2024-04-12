const Office= require("../models/office-model")
const User=require('../models/user-model')
const Amenity=require("../models/amenity-model")
const Space=require("../models/space-model")
const Booking=require("../models/booking-model")
const {validationResult}=require("express-validator")
const bookingCltrs={}

//const axios = require('axios')
//require('dotenv').config()

//create a booking 
bookingCltrs.create=async (req,res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {body}=req
    try{
        const booking= new Booking(body)
        booking.user=req.user.id
        //need to get the prices of the spaces and aminities
        const spaceIds = booking.spaces.map(ele => ele.space )
        // const products = await Product.find().where('_id').in(productIds)
        const spaces = await Space.find({ _id: [...spaceIds]})
        
        for(let i = 0; i < spaces.length;i++) {
            booking.spaces[i].price = spaces[i].bookingType.find((ele)=>{return ele.option==booking.type}).price //try without bracket or find it first and store in a variable
        }

        //aminities
        const amenityIds= booking.extraAminities
        const aminities= await Amenity.find({_id:[...amenityIds]})

        for(let i = 0; i < aminities.length;i++) {
            booking.extraAminities[i].price = aminities[i].price //try without bracket or find it first and store in a variable
        }

//calculate the space price and aminities price separately

        // invoiceObj.grossTotal = invoiceObj.lineItems.reduce((acc, cv) => {
        //     return acc + cv.price * cv.quantity 
        // }, 0)
        
        await booking.save()
        res.status(201).json(job)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}



module.exports=bookingCltrs
