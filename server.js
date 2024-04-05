//.env file setup
require('dotenv').config()
//1- initial server running with a port
const express=require("express")
const cors=require("cors")
const app=express()
const port=3100

const configureDB=require("./config/db")
configureDB()

app.use(cors())
app.use(express.json())

app.listen(port,()=>{
    console.log("server connected to the port no",port)
})