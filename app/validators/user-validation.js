const User= require("../models/user-model")
 //importing path/packages in backend (es5/es6)

const userRegisterSchema ={
    username: {
        exists: {
            errorMessage: 'username field is required'
        },
        notEmpty:{
            errorMessage:"username value is required"
        },
        trim:true  // validators vs sanitizers in express-validator
        //name some of the sanitizer
    },
    email:{
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty:{
            errorMessage:"Email value is required"
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
                    //custom validation
                    //When to do custom validation
                    //What is throw? What provides us the Error?

                }
            } 
        },
        trim: true,
        normalizeEmail: true //
    },
    password:{
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty:{
            errorMessage:"Password value is required"
        },
        isLength:{
            options:{min:8,max:128},//options in some validatior
            errorMessage:"Password should be between 8-128 characters"
        }, //isStrongPassword:{},
        trim:true
    },
    role:{
        
        notEmpty:{
            errorMessage:"Role is required"
        },
        isIn:{
            options:[['user','proprietor','admin']],//isIn takes options like array
            errorMessage:'role should either be a user or proprietor'
        }
    }
    // role:{
    //     default:'' //setting default value, it comes under sanitizer
    // default in express-validator has some problem},

}

const userLoginSchema= {
    email:{
        exists: {
            errorMessage: 'email field is required'
        },
        trim: true,
        notEmpty:{
            errorMessage:"Email value is required"
        },
        isEmail:{
            errorMessage:"Email should be in a valid format"
        },
        
        normalizeEmail: true
    },
    password:{
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty:{
            errorMessage:"Password value is required"
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
// how to export functions/object/variables from backend (es5 vs es6)

//throw
/*In JavaScript, throw is a keyword that is used to manually raise an exception (or error) during the execution of your code. When you use throw, you are explicitly creating and throwing an error, which can then be caught and handled elsewhere in your code.

throw is often used in conjunction with try...catch blocks to gracefully handle errors and exceptions in JavaScript code. It allows you to detect exceptional situations and handle them in a controlled manner, preventing your application from crashing or behaving unexpectedly.*/

/*
In the provided code snippet, the Error object being used is not specific to Mongoose. It's a built-in JavaScript Error object, which is available in all JavaScript environments, including Node.js.

When you write throw new Error("Email already exists"), you're creating a new instance of the Error object with a specific error message, "Email already exists". This error message is then propagated up the call stack until it's caught by an error handler or reaches the global error handler, where it can be handled appropriately.

In the context of Mongoose, you might encounter Mongoose-specific error objects when interacting with the database. For example, when performing database operations using Mongoose methods like findOne, save, etc., Mongoose may throw specific error objects for validation errors, database errors, and other types of errors that occur during database operations.

However, in the provided code snippet, the Error object is a generic JavaScript Error object, not a Mongoose-specific error object. It's used to create a custom error message for validation purposes in the Express.js application.*/


//regarding default role

/*
link--> https://github.com/express-validator/express-validator/issues/1057

default in express-validator does not work properly with other validators like "options", and it also not added the field like mongoose default during model creation

Now, if we add default in model's express-validator, it will save in controller's .save method, i.e., at the time of insertion inside the database. So it will throw error during validations,as validation is done earlier as a middleware.

For this reason it's better to add from the front-end.
*/