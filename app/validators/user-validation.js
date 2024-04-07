const User= require("../models/user-model") //

const userRegisterSchema ={
    username: {
        exists: {
            errorMessage: 'application date is required'
        },
        notEmpty:{
            errorMessage:"username is required"
        },
        trim:true  //
    },
    email:{
        exists: {
            errorMessage: 'application date is required'
        },
        notEmpty:{
            errorMessage:"Email is required"
        },
        isEmail:{
            errorMessage:"Email should be in a valid format"
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email:value})
                if(!user){
                    return true
                } else{
                    throw new Error("Email already exists")
                    //
                }
            } 
        },
        trim: true,
        normalizeEmail: true //
    },
    password:{
        exists: {
            errorMessage: 'application date is required'
        },
        notEmpty:{
            errorMessage:"Password is required"
        },
        isLength:{
            options:{min:8,max:128},//
            errorMessage:"Password should be between 8-128 characters"
        }, //isStrongPassword:{},
        trim:true
    },

    role:{
        notEmpty:{
            errorMessage:"Role is required"
        },
        isIn:{
            options:[['user','proprietor','admin']],//
            errorMessage:'role should either be a candidaate or recruiter'
        },
        default:"user"
    }
}

const userLoginSchema= {
    email:{
        exists: {
            errorMessage: 'application date is required'
        },
        notEmpty:{
            errorMessage:"Email is required"
        },
        isEmail:{
            errorMessage:"Email should be in a valid format"
        },
        trim: true,
        normalizeEmail: true
    },
    password:{
        exists: {
            errorMessage: 'application date is required'
        },
        notEmpty:{
            errorMessage:"Password is required"
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:"Password should be between 8-128 characters"
        },
        trim:true
    }
}

module.exports={
    userRegisterSchema: userRegisterSchema,
    userLoginSchema : userLoginSchema
}
//