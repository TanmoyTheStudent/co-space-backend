const Office= require("../models/office-model")
const User=require('../models/user-model')
const Amenity=require("../models/amenity-model")
const {validationResult}=require("express-validator")
const officeCltrs={}
const axios = require('axios')
require('dotenv').config()

//create a particular office
officeCltrs.create=async (req,res) =>{
    // const errors=validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()})
    // }
    const {body,file}=req

    const streetModification=(str)=>{
       
        const streetArr = str.split(' ')
        //console.log(streetArr)
        
        let street=""
        for(let i=0;i<streetArr.length;i++){
            if(i==0){
                street=streetArr[i]
            }else{
                street=street+"%20"+streetArr[i]
            }
        }
        //let street = str.replace(/ /g, "%20")
       // console.log(street)
        return street
    }
    

    try{
        const office= new Office(body)
        //console.log(office)
        office.user=req.user.id
        //console.log(office.user)
        //console.log(office)
        //location need to be added here
        //street-need to add %20 at space
        
        
      
        const street=streetModification(body.address.street)

        // console.log(street)
        // console.log(`https://api.geoapify.com/v1/geocode/search?housenumber=${body.address.houseNumber}&street=${street}&postcode=${body.address.postCode}&city=${body.address.city}&state=${body.address.state}&country=${body.address.country}&format=json&apiKey=${process.env.API_KEY_GEOAPIFY}`)

        const  mapResponse =  await axios.get(`https://api.geoapify.com/v1/geocode/search?housenumber=${body.address.houseNumber}&street=${body.address.street}&postcode=${body.address.postCode}&city=${body.address.city}&state=${body.address.state}&country=${body.address.country}&format=json&apiKey=${process.env.API_KEY_GEOAPIFY}`)

        //console.log("mapresponse",mapResponse.data)

        if(mapResponse.data.results.length==0){
           return  res.status(400).json({errors:[{msg:"Invalid address",path:'invalid address'}]})
        }
        
        office.location = {latitude:mapResponse.data.results[0].lat,
        longitude:mapResponse.data.results[0].lon}
        //console.log("location",office.location)
        //image needs to be added separately as it is in req.file, not req.body 
       
       // office.image=file.path //for only single image
        //office.image=file.filename
        await office.save()
        res.status(201).json(office)

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

//show a single office-- public route--anyone can see a specific office details, but if the user wants to book the office he/she has to login

officeCltrs.show= async (req,res) =>{
    const id =req.params.id
    try{
        const office= await Office.findById(id)
        res.json(job)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal server error"})
        //res.status(500).json(err)
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



