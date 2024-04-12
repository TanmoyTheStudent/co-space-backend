//.env file setup
require('dotenv').config()
//1- initial server running with a port
const express=require("express")
const cors=require("cors")
const app=express()
const port=process.env.PORT|| 3100


const configureDB=require("./config/db")
configureDB()

app.use(cors())
app.use(express.json())

app.listen(port,()=>{
    console.log("server connected to the port no",port)
})

//2-user registration and login routes

//requiring validators and controllers

const {checkSchema}=require("express-validator")

const { userRegisterSchema,
userLoginSchema}=require("./app/validators/user-validation")

const userCltrs=require("./app/controllers/user-controller")

app.post("/api/users/register",checkSchema(userRegisterSchema),userCltrs.register)

app.post('/api/users/login',checkSchema(userLoginSchema),userCltrs.login)

const {authenticateUser, authorizeUser}=require("./app/middlewares/auth")

app.get('/api/users/account',authenticateUser,userCltrs.account)

//3- office related api

const officeCltrs= require("./app/controllers/office-controller")

//const officeValidationSchema = require('./app/validators/office-validation')


//creating a office
app.post('/api/offices/create',authenticateUser,authorizeUser(['proprietor']),officeCltrs.create) //checkSchema(jobValidationSchema)

//get all the office details
 app.get('/api/offices',officeCltrs.list)
 //only one office details
 app.get('/api/offices/:id',officeCltrs.show) //showing details of a specific office-- public router

//showing all offices under an owner
app.get('/api/offices/my',authenticateUser,authorizeUser(['proprietor']),officeCltrs.myoffices)

//update an office details
 app.put('/api/offices/update/:id',authenticateUser,authorizeUser(['proprietor']),checkSchema(jobValidationSchema),officeCltrs.update)

 //delete an office
app.delete('/api/offices/delete/:id',authenticateUser,authorizeUser(['proprietor']),officeCltrs.delete)
