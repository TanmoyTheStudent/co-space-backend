const { validationResult } = require('express-validator')
const Member = require('../models/member-model')
const memberCltrs = {}

memberCltrs.create = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(500).json({errors:errors.array()})
    }
    try {
    const { body, files } = req
    if (Object.keys(files).length!=2) {
        return res.status(400).json({ error: 'Pictures are required' });
    }
   // console.log(body)
    console.log("req files",files)
    
     const member = new Member(body)

    member.userId = req.user.id
    // Add profile picture path to body
     member.profileImage = files.profileImage[0].path
     member.personalDetails.documentPhoto=files.documentPhoto[0].path 
     await member.save()
    // // member.userId = req.user.id
    // // const member = await Member.create(body)
     res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err: err.message })
 }
}

memberCltrs.update = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(500).json({errors:errors.array() })
    }
    try {
        //const id = req.params.id
        const body = req.body 
        const member = await Member.findOneAndUpdate({userId:req.user.id}, body, {new:true})
        res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

memberCltrs.remove = async(req, res) => {
    try{
        const id = req.params.id
        const member = await Member.findByIdAndDelete(id)
        res.status(200).json(member)
    } catch(err) {
        res.status(400).json({err:'internal server error'})
    }
}

memberCltrs.profile=async (req,res)=>{
    try{
        
       // const profile=await Member.findById(req.user.id)
       const profile=await Member.find({userId:req.user.id})
      if(profile.length>0){
        res.json(profile[0])
      }else{
        res.json(null)
      }
        
        console.log("member controller",profile)
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'})
    }

}

module.exports = memberCltrs