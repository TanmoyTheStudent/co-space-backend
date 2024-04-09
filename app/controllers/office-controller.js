const Office= require("../models/office-model")
const User=require('../models/user-model')
const Amenity=require("../models/amenity-model")
const {validationResult}=require("express-validator")
const officeCltrs={}
const axios = require('axios')
require('dotenv').config()

//create a particular office
officeCltrs.create=async (req,res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {body,file}=req
    try{
        const office= new Office(body)
        office.user=req.user.id
        //location need to be added here
        //street-need to add %20 at space
        const  mapResponse =  await axios.get(`https://api.geoapify.com/v1/geocode/search?housenumber=${body.address.houseNumber}&street=${body.address.street}&postcode=${body.address.postCode}&city=${body.address.city}&state=${body.address.state}&country=${body.address.country}&format=json&apiKey=${process.env.API_KEY_GEOAPIFY}`)
        if(mapResponse.data.features.length==0){
           return  res.status(400).json({errors:[{msg:"Invalid address",path:'invalid address'}]})
        }
        office.location = {latitude:mapResponse.data.features[0].properties.lat,
        longitude:mapResponse.data.features[0].properties.lon}

        //image needs to be added separately as it is in req.file, not req.body 
        office.image=file.path //for only single image
        //office.image=file.filename
        await office.save()
        res.status(201).json(job)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//show all the offices
officeCltrs.list= async (req,res)=>{
    try{
        const offices= await Office.find().sort({createdAt:-1})
        res.json(offices)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}


//Show the offices belong to a particular owner
officeCltrs.myoffices= async (req,res)=>{
    try{
        const offices= await Office.find({user:req.user.id}).sort({createdAt:-1})
        res.json(offices)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//update an office information by the owner

officeCltrs.update= async (req,res) =>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id= req.params.id
    const body=req.body
    try{
        const office=await Office.findOneAndUpdate({ _id:id, user: req.user.id },body,     {new:true})
        res.json(office)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//delete an office details by the owner or by the admin
//softdelete option should be there, final delete would be by the admin
officeCltrs.delete=async (req,res) =>{
    const id = req.params.id
try{   
    const office= await Office.findOneAndDelete({_id: id, user: req.user.id})
    res.json(office)
}catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server error"})
}
}

module.exports=officeCltrs
