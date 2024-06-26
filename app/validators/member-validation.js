const Member = require('../models/member-model')

const memberValidationSchema = {
    profileImage: {
       in:["form-data"],
        notEmpty: {
            errorMessage: 'profile image is required'
        }
    },

        'personalDetails.fullName': {
            notEmpty: {
                errorMessage:'full name is required'
            },
            trim: true
        },
        'personalDetails.fullAddress': {
            notEmpty: {
                errorMessage:'full address is required'
            }
        },
        'personalDetails.occupation': {
            notEmpty: {
                errorMessage:'occupation is required'
            }
        },
        'personalDetails.purpose': {
            notEmpty: {
                errorMessage:'purpose is required'
            }
        },
        'personalDetails.documentType': {
            notEmpty: {
                errorMessage:'document type is required'
            }
        },
        'personalDetails.documentNo': {
            notEmpty: {
                errorMessage:'document number is required'
            }
        }

        // 'personalDetails.bankAccount': {
        //     notEmpty: {
        //         errorMessage:'bank account number is required'
        //     },
        //     isLength: {
        //         options: { min: 11 }
        //     },
        //     isNumeric: {
        //         errorMessage:'Numbers only'
        //     },
        //     trim: true
        // }   
 }

module.exports = memberValidationSchema