//const Category = require('../models/category-model')

const categoryValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'name is required'
        },
        trim:true
    }
}

module.exports = categoryValidationSchema