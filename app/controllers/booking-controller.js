const Office= require("../models/office-model")
const User=require('../models/user-model')
const Amenity=require("../models/amenity-model")
const Space=require("../models/space-model")
const Booking=require("../models/booking-model")
const {validationResult}=require("express-validator")

const bookingCltrs={}

//const axios = require('axios')
//require('dotenv').config()

const currentTime=()=>{
    // Get the current date
 const currentDate = new Date();

// Add 5 hours and 30 minutes
const hoursToAdd = 5;
const minutesToAdd = 30;

//  Convert hours and minutes to milliseconds
const millisecondsToAdd = (hoursToAdd * 60 * 60 * 1000) + (minutesToAdd * 60 * 1000);

// Add milliseconds to current date
const newDate = new Date(currentDate.getTime() + millisecondsToAdd)
return newDate
}


const dailyEndTime=()=>{
    //Create a new Date object
const newDate = new Date()

//Set hours, minutes, seconds, and milliseconds to zero
newDate.setHours(29, 29, 0, 0)

 // Display the new date
console.log(newDate)
return newDate
}

const weeklyEndTime=()=>{
    //Create a new Date object
const newDate = new Date()

//Set hours, minutes, seconds, and milliseconds to zero
newDate.setHours(29, 29, 0, 0)

// Add 7 days
newDate.setDate(newDate.getDate() + 7)

 // Display the new date
console.log(newDate)
return newDate
}

const monthlyEndTime=()=>{
    //Create a new Date object
const newDate = new Date()

//Set hours, minutes, seconds, and milliseconds to zero
newDate.setHours(29, 29, 0, 0)

// Add 30 days
newDate.setDate(newDate.getDate() + 30)

 // Display the new date
console.log(newDate)
return newDate
}


bookingCltrs.create=async (req,res)=>{
    // const errors=validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()})
    // }

    const {body}=req

    try{
        const booking=new Booking(body)
        console.log(booking)
        const space = await Space.findById( booking.space)
        // console.log(space)
        // console.log(space.bookingType)
        // console.log(space.freeAmenities)
        booking.price = space.bookingType.find((ele)=>{return ele.option==booking.bookType}).price

         //amenities
         let total=0
         if(booking.extraAmenities.length>0){
         const paidAmenities=space.paidAmenities.map(ele=>ele.amenity)
         let otherExtraAmenities=[]
        for(let i=0;i<paidAmenities.length;i++){
            if(booking.extraAmenities.includes(paidAmenities[i])){
                if(booking.bookType=="daily"){
                    total=total+space.paidAmenities[i].dailyPrice
                }else if (booking.bookType=="weekly"){
                    total=total+space.paidAmenities[i].weeklyPrice
                    
                }else{
                    total=total+space.paidAmenities[i].monthlyPrice
                }
                otherExtraAmenities=booking.extraAmenities.filter(ele=>ele!=paidAmenities[i])
            }
        } 
        
        if(otherExtraAmenities.length>0){
        //const amenityIds= booking.extraAmenities.map(ele=>ele.aminity)
        //const amenities= await Amenity.find({_id:[...amenityIds]})

        //rest extra-amenities/paid amenities
        const amenities= await Amenity.find({_id:otherExtraAmenities})

        console.log("amenities",amenities)
       

        // for(let i = 0; i < aminities.length;i++) {
        //     booking.extraAminities[i].price = aminities[i].price //try without bracket or find it first and store in a variable
        // }

        if(booking.bookType=="daily"){
            for(let i = 0; i < amenities.length;i++) {
                total += amenities[i].amenityCharge[0].price   
               
                }
        }else if (booking.bookType=="weekly"){
            for(let i = 0; i < amenities.length;i++) {
                total += amenities[i].amenityCharge[1].price   
               
                }
            
        }else{
            for(let i = 0; i < amenities.length;i++) {
                total += amenities[i].amenityCharge[2].price   
               
                }
        }
    }
  }
        booking.totalAmount=(booking.price+total)*booking.quantity
        //time calculation
        if(booking.bookType=="daily"){
            booking.bookingTime.starting= currentTime()
            booking.bookingTime.ending=dailyEndTime()
            //here we can add the timings into space
        }else if (booking.bookType=="weekly"){
            booking.bookingTime.starting= currentTime()
            booking.bookingTime.ending=weeklyEndTime()
        }else{
            booking.bookingTime.starting= currentTime()
            booking.bookingTime.ending=monthlyEndTime()
        }

        booking.user=req.user.id
        const invoice= await booking.save()

        // const obj={
        //     id:invoice._id,
        //     quantity:invoice.quantity,
        //     startingTime:invoice.bookingTime.starting,
        //     endingTime:invoice.bookingTime.ending
        // }

        // space.booking.push(obj)
        // await space.save()


        res.status(201).json(booking)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//create a booking for advance situation
bookingCltrs.createAdvanced=async (req,res) =>{
    // const errors=validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()})
    // }
    const {body}=req
    try{
        const booking= new Booking(body)
        console.log(booking)
        //booking.user=req.user.id
        //need to get the prices of the spaces and aminities
        const spaceIds = booking.spaces.map(ele => ele.space )
        console.log(spaceIds)
        // const products = await Product.find().where('_id').in(productIds)
        const spaces = await Space.find({ _id: [...spaceIds]})
        console.log(spaces)
        
        for(let i = 0; i < spaces.length;i++) {
            booking.spaces[i].price = spaces[i].bookingType.find((ele)=>{return ele.option==booking.spaces[i].bookingType}).price //try without bracket or find it first and store in a variable

            if(booking.spaces[i].bookingType=="daily"){
                booking.spaces[i].bookingTime.starting= currentTime()
                booking.spaces[i].bookingTime.ending=dailyEndTime()
                //here we can add the timings into space
            }
        }

        //aminities
        
        //const amenityIds= booking.extraAminities.map(ele=>ele.aminity)
        //const aminities= await Amenity.find({_id:[...amenityIds]})

        // for(let i = 0; i < aminities.length;i++) {
        //     booking.extraAminities[i].price = aminities[i].price //try without bracket or find it first and store in a variable
        // }

//calculate the space price and aminities price separately
        /* const totalQuantity=booking.spaces.reduce((acc, cv) => {
            return acc + cv.bookingQuantity 
        }, 0)
        console.log(totalQuantity)
        booking.totalAmount = booking.spaces.reduce((acc, cv) => {
            return acc + cv.price * cv.bookingQuantity 
        }, 0) */

        //+(booking.extraAminities.reduce((acc,cv)=>{
           // return acc+cv.price
        //},0)*totalQuantity)

        //time calculation 

        
        
        const invoice= await booking.save()

        //now insert the booking id into sapces and profiles of customer 
        //from space the id should be removed from the end time , but in customer profile it should be stored 

       /* const customer= await Customer.findById(invoice.customer)
        customer.outstandingBalance += invoice.netTotal
        customer.purchaseHistory.push({ invoice: invoice._id})
        await customer.save() */

        res.status(201).json(booking)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

bookingCltrs.regularUpdatation=async (req,res)=>{
    try{
        const result=await Booking.find({"bookingTime.ending":{ $lt: new Date() } }, { _id: 1 }) //give $gt also if regularly updates 
       // console.log("boooking-result",result)

        const bookingIds = result.map(doc => doc._id.toString())
        console.log("only required booking id",bookingIds)

        const spaces=await Space.find()
        console.log("all spaces",spaces)

        for (let i = 0; i < spaces.length; i++) {
            const bookings = spaces[i].booking;
           // console.log("L1",bookings)
            const filteredBookings = bookings.filter(item => !bookingIds.includes(item.id.toString()));
           // console.log("L2",filteredBookings)
            spaces[i].booking = filteredBookings;
            await spaces[i].save()
           
        }
        console.log("modified spaces",spaces)

        //  const result2=await Space.updateMany(spaces)
        //  console.log("updated spaces",result2)
    }catch(err){
        console.log(err)
    }
}

//getting full booking lists
bookingCltrs.list = async (req, res) => {
    try {
        console.log(req.user)
        const bookings = await Booking.find({status:"Successful"}).populate('user', ['_id','username']).populate('office', ['_id','title']).populate({
            path: 'space',
            populate: { path: 'category' } // Populate the category field under the space schema
          }).populate('extraAmenities') //populate the array extraAmenities

        res.status(200).json(bookings)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}


module.exports=bookingCltrs

/* 

invoicesCltr.list = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('customer', ['_id', 'name']).populate('lineItems.product', ['_id','name'])
        res.json(invoices)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
} 

*/