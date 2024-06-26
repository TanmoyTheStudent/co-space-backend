const Booking = require('../models/booking-model')

const bookingValidationSchema = {
    bookType: {
        notEmpty: {
            errorMessage: 'booking Type is required'
        }       
    },
    price: {
        notEmpty: {
            errorMessage: 'comment is required'
        },
        trim: true
    }
}

module.exports = bookingValidationSchema

