const Office = require('../models/office-model')

const officeValidationSchema = {
    title : {
       // in:["form-data"],
        notEmpty: {
            errorMessage: 'office-name(title) is required'
        },
        trim:true
    },
    "address.houseNumber": {
       // in:["form-data"],
        notEmpty: {
            errorMessage: 'House number in address is required'
        },
        isNumeric: {
            errorMessage: 'House number should be a number'
        },
        trim:true
    },
    "address.street": {
       // in:["form-data"],
        notEmpty: {
            errorMessage: 'Street in address is required'
        },
        trim:true
    },
    "address.postCode": {
       // in:["form-data"],
        notEmpty: {
            errorMessage: 'Postcode in address is required'
        },
        isNumeric: {
            errorMessage: 'Postcode should be a number'
        },
        trim:true
    },
    "address.city": {
        //in:["form-data"],
        notEmpty: {
            errorMessage: 'City in address is required'
        },
        trim:true
    },
    "address.state": {
       // in:["form-data"],
        notEmpty: {
            errorMessage: 'State in address is required'
        },
        trim:true
    },
    "address.country": {
      //  in:["form-data"],
        notEmpty: {
            errorMessage: 'Country in address is required'
        },
        trim:true
    },

    capacity: {
       // in:["form-data"],
        notEmpty: {
            errorMessage: 'capacity is required'
        },
        isNumeric: {
            errorMessage: 'shound be a number'
        }
    }
}
module.exports = officeValidationSchema