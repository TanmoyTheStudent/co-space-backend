const Review = require('../models/review-model')

const reviewValidationSchema = {
    rating: {
        notEmpty: {
            errorMessage: 'rating is required'
        }       
    },
    review: {
        notEmpty: {
            errorMessage: 'comment is required'
        },
        trim: true
    }
}

module.exports = reviewValidationSchema

