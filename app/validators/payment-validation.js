const Booking = require('../models/booking-model')

const paymentsValidationSchema = {
  bookingId:{
        notEmpty: {
          errorMessage: "invoice ID is empty",
        },
        isMongoId: {
          errorMessage: "Invalid ID format",
        },
        custom: {
          //checks wheather id found in database
          options: async (value, { req, res }) => {
            const id = req.body.bookingId
            
            const findId = await Booking.findById(id)
            if (findId) {
              return true
            } else {
              throw new Error("Invoice Id not found")
            }
          }
        }
      },
    // productName:{
    //     notEmpty: {
    //         errorMessage: "invoice ID is empty",
    //   }
    //   },
    amount:{
        notEmpty:{
            errorMessage:'Amount cannot be empty'
        },
        custom: {
            //checks wheather amount matches to specific invoice
            options: async (value, { req, res }) => {
              const id = req.body.bookingId
              const amount = req.body.amount
              const findInvoice = await Booking.findById(id)
              if (findInvoice.totalAmount == amount) {
                return true
              } else {
                throw new Error("Invalid amount")
              }
            }
        }   
    }
}

module.exports = paymentsValidationSchema