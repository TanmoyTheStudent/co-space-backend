//.env file setup
require('dotenv').config()
//1- initial server running with a port
const express=require("express")
const cors=require("cors")
const app=express()
const port=process.env.PORT|| 3100
const cron  = require('node-cron')
const path=require('path')

const configureDB=require("./config/db")
configureDB()

app.use(cors())
app.use(express.json())

app.listen(port,()=>{
    console.log("server connected to the port no",port)
})

//multer

const multer = require('multer')
//Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images') // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // File name format: timestamp-originalname
    }
});

//Initialize Multer instance
const upload = multer({ storage: storage });
app.use('/uploads/images',express.static(path.join(__dirname,'uploads/images')))

//2-user registration and login routes

//requiring validators and controllers

const {checkSchema}=require("express-validator")
const { userRegisterSchema,
userLoginSchema}=require("./app/validators/user-validation")

const userCltrs=require("./app/controllers/user-controller")
app.post("/api/users/register",checkSchema(userRegisterSchema),userCltrs.register)
app.post('/api/users/login',checkSchema(userLoginSchema),userCltrs.login)

//requiring authenticateUser & authorizeUser
const {authenticateUser, authorizeUser}=require("./app/middlewares/auth")
app.get('/api/users/account',authenticateUser,userCltrs.account)

//3- members

const memberCltrs=require("./app/controllers/member-controller")
const memberValidationSchema=require("./app/validators/member-validation")

//app.post("/api/members",upload.single('image'),memberCltrs.create)
//app.post("/api/members", upload.fields([{name:'profileImage' ,maxCount:1 }, {name: 'documentPhoto', maxCount:1}]) ,checkSchema(memberValidationSchema),memberCltrs.create)
app.post("/api/members",authenticateUser, upload.fields([{name:'profileImage' ,maxCount:1 }, {name: 'documentPhoto', maxCount:1}]) ,checkSchema(memberValidationSchema),memberCltrs.create)
app.get("/api/members/view-profile",authenticateUser,memberCltrs.profile)
// app.get("/api/bookings",bookingCltrs.list)
app.put("/api/members",authenticateUser, upload.fields([{name:'profileImage' ,maxCount:1 }, {name: 'documentPhoto', maxCount:1}]),checkSchema(memberValidationSchema),memberCltrs.update)
// app.delete('/api/bookings/:id',bookingCltrs.remove)

//4-category routes


const categoryValidationSchema = require('./app/validators/category-validation')
const categoryCltrs = require('./app/controllers/category-controller')

app.get('/api/categories',authenticateUser,authorizeUser(['admin','proprietor']) , categoryCltrs.list)
app.post('/api/categories',authenticateUser,authorizeUser(['admin']) , checkSchema(categoryValidationSchema), categoryCltrs.create)
app.put('/api/categories/:id', authenticateUser, authorizeUser(['admin']), checkSchema(categoryValidationSchema), categoryCltrs.update)
app.delete('/api/categories/:id', authenticateUser, authorizeUser(['admin']), categoryCltrs.remove)

//app.get('/api/categories/:id', categoryCltrs.category)

// 5-amenity routes

const amenityCltrs=require("./app/controllers/amenity-controller")
const {createAmenityValidationSchema,updateAmenityValidationSchema}=require("./app/validators/amenity-validation")

//app.post("/api/amenities",amenityCltrs.create)
app.post("/api/amenities",authenticateUser,authorizeUser(['admin']),checkSchema(createAmenityValidationSchema),amenityCltrs.create)
 app.get("/api/amenities",authenticateUser,authorizeUser(['admin','proprietor']),amenityCltrs.list)
 app.put("/api/amenities/:id",authenticateUser,authorizeUser(['admin']),checkSchema(updateAmenityValidationSchema),amenityCltrs.update)
app.delete('/api/amenities/:id',authenticateUser,authorizeUser(['admin']),amenityCltrs.remove)


//6- office related api

const officeCltrs= require("./app/controllers/office-controller")
const officeValidationSchema = require('./app/validators/office-validation')

//creating a office
app.post('/api/offices',authenticateUser,authorizeUser(['proprietor']),upload.single('image'),checkSchema(officeValidationSchema)
,officeCltrs.create) 

//get all the office details
app.get('/api/offices',officeCltrs.list)
app.get('/api/offices/search',officeCltrs.search)
 //only one office details
// app.get('/api/offices/:id',officeCltrs.show) //showing details of a specific office-- public router

//showing all offices under an owner
app.get('/api/offices/my',authenticateUser,authorizeUser(['proprietor']),officeCltrs.myoffices)

//showing all un-approved offices to admin 
app.get('/api/offices/unapproved',authenticateUser,authorizeUser(['admin']),officeCltrs.unapprovedOffices)

//showing all soft-deleted offices to admin 
app.get('/api/offices/softdeletelist',authenticateUser,authorizeUser(['admin']),officeCltrs.softDeleteList)

//approved by admin
app.put('/api/offices/approval',authenticateUser,authorizeUser(['admin']),officeCltrs.approval)

//update an office details
 app.put('/api/offices/:id',authenticateUser,authorizeUser(['proprietor']),upload.single('image'),checkSchema(officeValidationSchema),officeCltrs.update)

//soft-delete an office by the owner
app.delete('/api/offices/:id/owner',authenticateUser,authorizeUser(['proprietor']),officeCltrs.softDelete)

 //delete an office permanently by the admin 
app.delete('/api/offices/:id',authenticateUser,authorizeUser(['admin']),officeCltrs.delete)

//see all the spaces of a particular office
app.get("/api/offices/:id/spaces",officeCltrs.listSpaces)

//7-spaces
const spaceCltrs=require("./app/controllers/space-controller")
const spaceValidationSchema=require("./app/validators/space-validation")


app.get("/api/spaces",spaceCltrs.list)
app.get("/api/spaces/:id",spaceCltrs.show)
//app.post("/api/spaces",upload.single('image'),spaceCltrs.create)
app.post("/api/spaces",authenticateUser,authorizeUser(['proprietor']),upload.single('image'),checkSchema(spaceValidationSchema),spaceCltrs.create)
app.put("/api/spaces/:id",authenticateUser,authorizeUser(['proprietor']),upload.single('image'),checkSchema(spaceValidationSchema),spaceCltrs.update)
// app.delete('/api/spaces/:id',spaceCltrs.remove)
app.put("/api/spaces/:id/paid-amenities",authenticateUser,authorizeUser(['proprietor']),spaceCltrs.paidAmenities) //validation required, make another validation in space validation for this route

//8-booking
const bookingCltrs=require("./app/controllers/booking-controller")
const bookingValidationSchema=require("./app/validators/booking-validation")

//app.post("/api/bookings",bookingCltrs.create)
app.post("/api/bookings",authenticateUser,authorizeUser(['user']),bookingCltrs.create)
//app.post("/api/bookings",checkSchema(bookingValidationSchema),authenticateUser,authorizeUser(['user','proprietor']),bookingCltrs.create)
app.get("/api/bookings",authenticateUser,authorizeUser(['user','proprietor','admin']),bookingCltrs.list)
// app.put("/api/bookings/:id",checkSchema(invoiceValidationSchema),bookingCltrs.update)
// app.delete('/api/bookings/:id',bookingCltrs.remove)


//9-Ratings
const reviewCltrs=require("./app/controllers/review-controller")
const reviewValidationSchema=require("./app/validators/review-validation")


app.post("/api/reviews",authenticateUser,authorizeUser(['user']),checkSchema(reviewValidationSchema),reviewCltrs.create);
app.get("/api/reviews/singleclient",authenticateUser,authorizeUser(['user']),reviewCltrs.singleclient);
app.get("/api/reviews/:id",reviewCltrs.list);
app.put("/api/reviews/:id",authenticateUser,authorizeUser(['user']),checkSchema(reviewValidationSchema),reviewCltrs.update);
app.delete('/api/reviews/:id/:spaceId',authenticateUser,authorizeUser(['user','admin']),reviewCltrs.remove);


//10-payment

const paymentsValidationSchema = require('./app/validators/payment-validation')
const paymentsCltr = require('./app/controllers/payment-controller')

app.post('/api/create-checkout-session',checkSchema(paymentsValidationSchema),paymentsCltr.pay)
app.put('/api/payments/:id/success',paymentsCltr.successUpdate)
app.put('/api/payments/:id/failed',paymentsCltr.failedUpdate)


//11-nodecron

// const task=cron.schedule('*/1 * * * *', async () => {
//     try {
//       await bookingCltrs.regularUpdatation()
//     } catch (error) {
//       console.error('Error', error)
//     }
// },{
//     scheduled: false // Don't schedule immediately
//     //timezone: 'your_timezone_here'
//   });
  
//   // Immediately execute the task once
//   task.start();


  
//   // Set a timeout to stop the task after a certain time (e.g., 5 minutes)
//   const timeout = setTimeout(() => {
//     // Stop the task
//     task.stop();
//     console.log('Task stopped after 2:30 minutes.');
//   }, 2 * 30 * 1000);


//   // Schedule a cron job to run at 12 a.m. (midnight) in Indian timezone (IST)
// cron.schedule('0 0 * * *',async () => {
//     try {
//       await bookingCltrs.regularUpdatation()
//       console.log('Cron job running at 12 a.m. in Indian timezone (IST)')
//     } catch (error) {
//       console.error('Error', error)
//     }
// }, {
//     timezone: 'Asia/Kolkata' // Indian Standard Time (IST) timezone
//   });
