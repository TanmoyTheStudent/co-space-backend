const Office= require("../models/office-model")
const Space= require("../models/space-model")
//const User=require('../models/user-model')
//const Amenity=require("../models/amenity-model")
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
    console.log(file)

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
       
        office.image=file.path //for only single image
        //office.image=file.filename
        
        await office.save()
        res.status(201).json(office)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//show all the offices that need admin approval
officeCltrs.unapprovedOffices= async (req,res)=>{
    try{
        const offices= await Office.find({adminApproval:false}).sort({createdAt:-1}).populate('user')
        res.status(200).json(offices)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//approval by admin
officeCltrs.approval= async (req,res) =>{

    const body=req.body
    try{
        const office=await Office.findByIdAndUpdate(body.id,{adminApproval:true},{new:true})
        res.status(200).json(office)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//show all the offices that are soft-deleted
officeCltrs.softDeleteList= async (req,res)=>{
    try{
        const offices= await Office.find({softDelete:true}).sort({createdAt:-1}).populate('user')
        res.status(200).json(offices)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//show all the offices
officeCltrs.list= async (req,res)=>{
    try{
        const offices= await Office.find({adminApproval:true,softDelete:false}).sort({createdAt:-1}).populate('availableAmenities')
        res.status(200).json(offices)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//search offices based on city
officeCltrs.search= async (req,res)=>{
    console.log(req.query)
    const  city = req.query.city||""
    try{
        const offices= await Office.find({adminApproval:true,"address.city":{ $regex: city, $options: 'i' }}).sort({createdAt:-1}).populate('availableAmenities')
        res.status(200).json(offices)
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
        res.status(200).json(office)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal server error"})
        //res.status(500).json(err)
    }
}

//Show the offices belong to a particular owner
officeCltrs.myoffices= async (req,res)=>{
    try{
        const offices= await Office.find({user:req.user.id}).sort({createdAt:-1}).populate("availableAmenities")
        res.status(200).json(offices)
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
        const office=await Office.findOneAndUpdate({ _id:id, user: req.user.id },body,{new:true})
        res.status(200).json(office)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//delete an office details by the owner or by the admin
//softdelete option should be there, final delete would be by the admin
//need to delete all the related spaces also

officeCltrs.softDelete=async (req,res) =>{
    const id = req.params.id
try{   
    const office= await Office.findOneAndUpdate({_id: id, user: req.user.id},{softDelete:true},{new:true})
    res.status(200).json(office)
}catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server error"})
}
}
//permenatly delete is uncompleted until the spaces related to it are not also deleted
officeCltrs.delete=async (req,res) =>{
    const id = req.params.id
try{   
    const office= await Office.findOneAndDelete({_id: id})
    res.status(200).json(office)
}catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server error"})
}
}

//for showing all spaces under an office, that is posted/created-- **space model needs to be importe/required in office-controller.js file

officeCltrs.listSpaces= async (req,res) =>{
    const id= req.params.id
    try{
    //     const job = await Job.findOne({_id:id, recruiterId: req.user.id }) //this will ensure us that the same recruiter should see all the applied applications, other recruiter should not see the applications
    // if(!job){
    //     return res.status(404).json({error: "job not found"})
    //     }
        const spaces= await Space.find({ office: id}).populate("category").populate("freeAmenities") //here we can use "id" also which is coming from req.params, but it's better to use the id coming from database
        res.status(200).json(spaces)
    }catch(err){
        res.status(500).json({error: "Internal server Error"})
    }

}

module.exports=officeCltrs



//Geo-apify
/* 
import fetch from 'node-fetch'; // npm install node-fetch

const response = await fetch(https://api.geoapify.com/v1/geocode/search?housenumber=2&street=knc%20road&postcode=700124&city=barasat&state=wb&country=india&format=json&apiKey=YOUR_API_KEY);
const data = await response.json();      

console.log(data);

*/

/* street location--adding %20
 const addressArr = body.address.split(',')
      const searchString = `${addressArr[0]}%2C%20${addressArr[1]}%2C%20${addressArr[2]}%2C%20${addressArr[3]}%2C%20${addressArr[4]}%2C%20${addressArr[5]}`
      
      */

//link :  https://myprojects.geoapify.com/api/7MjkTmmh04EQYDLTLutr/keys
