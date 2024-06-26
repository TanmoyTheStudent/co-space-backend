const Payment = require('../models/payment-model')
const Space=require("../models/space-model")
const Booking=require("../models/booking-model")
const { validationResult } = require('express-validator')
const stripe = require('stripe')(process.env.SECRETKEY_STRIPE)
const {pick} = require('lodash')
const paymentsCltr={}

paymentsCltr.pay = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = pick(req.body,['bookingId','amount'])
    try{

        //create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        })
        
        //create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:"singleseat"
                    },
                    unit_amount:body.amount * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/payment-success",
            cancel_url: 'http://localhost:3000/payment-failed',
            customer : customer.id
        })
        
        //create a payment
        const payment = new Payment(body)
        payment.bookingId=body.bookingId
        payment.transactionId = session.id
        //payment.productName=body.productName
        payment.amount = Number(body.amount)
        payment.paymentType = "card"
        await payment.save()
        res.json({id:session.id,url: session.url})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.successUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, body,{new:true}) 

        const updatedBooking = await Booking.findByIdAndUpdate( updatedPayment.bookingId,{status:"Successful"},{new:true})

        console.log("updated booking in paymentsCltr.successUpdate",updatedBooking)

        const space = await Space.findById( updatedBooking.space)
        
        const obj={
            id:updatedBooking._id,
            quantity:updatedBooking.quantity,
            startingTime:updatedBooking.bookingTime.starting,
            endingTime:updatedBooking.bookingTime.ending,
            status:updatedBooking.status
        }
        space.booking.push(obj)
        const updatedSpace=await space.save()
        console.log("updated space in paymentsCltr.successUpdate",updatedSpace)

        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.failedUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, body,{new:true}) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = paymentsCltr