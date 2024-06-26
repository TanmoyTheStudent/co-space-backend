const { Schema, model} = require('mongoose')

const paymentsSchema = new Schema({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking"
    },
   // productName:String,
    amount: Number,
    paymentType: String,
    transactionId: {        //Session object id
        type: String,
        default: null
    },                              
    paymentStatus: {
        type: String,
        enum: ['pending', 'Successful','Failed'],
        default: "pending"
    }
}, {
    timestamps: true
})

const Payment = model('Payment', paymentsSchema)

module.exports = Payment