const Space = require('../models/space-model')

const spaceValidationSchema = {
    office:{
        notEmpty: {
          errorMessage: "Office ID is empty"
        },
        isMongoId: {
          errorMessage: "Invalid office ID format"
        }
    },
    
    category:{
        notEmpty: {
          errorMessage: "Category ID is empty"
        },
        isMongoId: {
          errorMessage: "Invalid Category ID format"
        }
    },

    // "bookingType.option":{
    //     notEmpty: {
    //         errorMessage: "bookingType is empty"
    //       },
    // },
    // "bookingType.price":{
    //     notEmpty: {
    //         errorMessage: "BookingType price is empty",
    //       },
    //     isNumeric:{
    //         errorMessage:"Booking Type price should be a number"
    //     }
    // },

    totalQuantity: {
        notEmpty: {
            errorMessage: 'Total Quantity is required'
        }
    },

    image: {
      in:["form-data"],
        notEmpty: {
            errorMessage: 'image is required'
        }
    }

}

module.exports = spaceValidationSchema