const Space= require("../models/space-model")
const Office= require("../models/office-model")
const User=require('../models/user-model')
const Amenity=require("../models/amenity-model")
const {validationResult}=require("express-validator")
const spaceCltrs={}


//create a space
spaceCltrs.create=async (req,res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {body,file}=req
    

    try{
        const space= new Space(body)
        console.log(space)
        console.log(file)
        
        //image needs to be added separately as it is in req.file, not req.body 
       
        space.image=file.path //for only single image
        //space.image=file.filename

        await space.save()
        res.status(201).json(space)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//show all the spaces
spaceCltrs.list= async (req,res)=>{
    try{
        const spaces= await Space.find().sort({createdAt:-1}).populate("category")
        res.json(spaces)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//show a single space-- public route--anyone can see a specific office details, but if the user wants to book the office he/she has to login

spaceCltrs.show= async (req,res) =>{
    const id =req.params.id
    try{
        const space= await Space.findById(id).populate("category").populate("freeAmenities")
        res.json(space)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal server error"})
        //res.status(500).json(err)
    }
}

//Show the spaces belong to a particular owner
spaceCltrs.myspaces= async (req,res)=>{
    try{
        const spaces= await Space.find({user:req.user.id}).sort({createdAt:-1})
        res.json(spaces)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//update an space information by the owner

spaceCltrs.update= async (req,res) =>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id= req.params.id
    const body=req.body
    console.log("id",id)
    console.log("body",body)
    try{
        const space=await Space.findByIdAndUpdate(id,body,{new:true}).populate('category')
        console.log("space",space)
        res.json(space)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//delete an space details by the owner or by the admin
//softdelete option should be there, final delete would be by the admin
spaceCltrs.delete=async (req,res) =>{
    const id = req.params.id
try{   
    const space= await Space.findOneAndDelete({_id: id, user: req.user.id})
    res.json(space)
}catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server error"})
}
}

//update the paidAmenities fields by the respective owner

spaceCltrs.paidAmenities=async (req,res)=>{
    // const errors=validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()})
    // }
    const id=req.params.id
    const body=req.body
    //console.log("req.body",body)
    try{
        const space=await Space.findById(id).populate("category").populate("freeAmenities")
        //console.log("space",space)
        const amenities=space.paidAmenities.filter((ele)=>{
            return ele.amenity!=body.amenity
        })
        //console.log("amenities",amenities)
        amenities.push(body)
        space.paidAmenities=amenities
        //console.log("space",space)
        const newSpace=await space.save()
        console.log("newSpace in spaceCltrs.paidAmenities",newSpace)
        res.json(space)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

//for showing all application under a job that is posted/created-- **application model needs to be importe/required in jobs-controller.js file
// jobsCltr.listApplications= async (req,res) =>{
//     const id= req.params.id
//     try{
//     const job = await Job.findOne({_id:id, recruiterId: req.user.id }) //this will ensure us that the same recruiter should see all the applied applications, other recruiter should not see the applications
//     if(!job){
//         return res.status(404).json({error: "job not found"})
//         }
//         const applications= await Application.find({ jobId: job._id}) //here we can use "id" also which is coming from req.params, but it's better to use the id coming from database
//         res.json(applications)
//     }catch(err){
//         res.status(500).json({error: "Internal server Error"})
//     }

// }

module.exports=spaceCltrs



