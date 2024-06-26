const Amenity = require('../models/amenity-model')

const createAmenityValidationSchema = {
    amenityName: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'name is required'
        },
        custom:{
            options: async function(value){
                const amenity = await Amenity.findOne({amenityName:value})
                if(!amenity){
                    return true
                } else{
                    throw new Error("Amenity already exists")
                }
            } 
        },
        trim: true
    },
    amenityCharge: {
        in: ['body'],
        custom: {
            options: (value) => {
                if (!Array.isArray(value)) {
                    throw new Error('Amenity charge should be an array');
                }
                value.forEach((ele, index) => {
                    if (!ele.option || !ele.price) {
                        throw new Error(`Amenity charge at index ${index} is missing type or price`);
                    }
                    if (!['daily', 'weekly', 'monthly'].includes(ele.option)) {
                        throw new Error(`Invalid type at index ${index}: should be daily, weekly, or monthly`);
                    }
                    if (isNaN(ele.price) || ele.price <= 0) {
                        throw new Error(`Invalid price at index ${index}: should be a positive number`);
                    }
                });
                return true;
            }
        }
    }
    }

    const updateAmenityValidationSchema = {
        amenityName: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'name is required'
            },
            trim: true
        },
        amenityCharge: {
            in: ['body'],
            custom: {
                options: (value) => {
                    if (!Array.isArray(value)) {
                        throw new Error('Amenity charge should be an array');
                    }
                    value.forEach((ele, index) => {
                        if (!ele.option || !ele.price) {
                            throw new Error(`Amenity charge at index ${index} is missing type or price`);
                        }
                        if (!['daily', 'weekly', 'monthly'].includes(ele.option)) {
                            throw new Error(`Invalid type at index ${index}: should be daily, weekly, or monthly`);
                        }
                        if (isNaN(ele.price) || ele.price <= 0) {
                            throw new Error(`Invalid price at index ${index}: should be a positive number`);
                        }
                    });
                    return true;
                }
            }
        }
        }

module.exports = {createAmenityValidationSchema,updateAmenityValidationSchema}