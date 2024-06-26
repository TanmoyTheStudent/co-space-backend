const mongoose = require('mongoose')

const { Schema, model } = mongoose

const memberSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    profileImage: String,
    personalDetails: {
        fullName: String,
        fullAddress: String,
        occupation: String,
        purpose: String,
        documentType: String,
        documentNo: String,
        documentPhoto:String
        
    },
    bookingHistory: {
        type:[Schema.Types.ObjectId],
        ref:'Booking'
    },
    preferences: {
        type: [Schema.Types.ObjectId],
        ref: 'Space'
    }
}, { timestamps: true })

const Member = model('Member', memberSchema)

module.exports = Member