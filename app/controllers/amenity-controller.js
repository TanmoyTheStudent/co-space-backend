const { validationResult } = require('express-validator')
const Amenity = require("../models/amenity-model")
amenityCltrs = {}

amenityCltrs.create = async (req, res) => {
    
    const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        
        try {
            const body = req.body
            //console.log("body",body)
            const amenity= await Amenity.create(body)

            // const amenity = new Amenity(body)
            // console.log("amenity",amenity)
            
            // body.amenityCharge.forEach((ele)=>{amenity.  amenityCharge.push(ele)})
            // console.log("new amenity",amenity)
            // await amenity.save()
            res.status(201).json(amenity)
        } catch(err) {
            console.log(err)
            res.status(500).json({ error: 'Internal server error'})
        }
}

amenityCltrs.list = async(req, res) => {
    try {
        const amenity = await Amenity.find()
        res.status(200).json(amenity)
    } catch(err) {
        res.status(500).json({ error: 'Internal server error'})
    }
}

amenityCltrs.update = async(req, res) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

    try {
        const id = req.params.id
        const body = req.body
        const amenity = await Amenity.findByIdAndUpdate( id, body, { new: true} )
        res.status(200).json(amenity)
    } catch(err) {
        res.status(500).json({ error: 'Internal server error'})
    }
}


amenityCltrs.remove = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Amenity.findByIdAndDelete(id)
        res.status(200).json(category)
    } catch(err) {
        res.status(500).json({ error: 'Internal server Error'})
    }
}



// amenityCltrs.amenity = async(req, res) => {
//     try {
//         const id = req.params.id
//         const amenity = await Amenity.findById(id)
//         res.json(amenity)
//     } catch {
//         res.status(400).json({ error: 'something went wrong'})
//     }
// }

module.exports = amenityCltrs
