const { validationResult }= require("express-validator")
const Category = require('../models/category-model')
const categoryCltrs = {} 

categoryCltrs.create = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    } 

    try {
        const body = req.body 
        const search = await Category.find({name:body.name})
        if(search.length!=0){
            return res.status(404).json({ error:"category already present" })
        }
        const category = await Category.create(body)
        res.status(201).json(category)
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error'})
    }
}

categoryCltrs.list = async(req, res) => {
    try {
        const category = await Category.find()
        res.status(200).json(category)
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error'})
    }
}

categoryCltrs.update = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }  

    try {
        const id = req.params.id
        const body = req.body
        const search = await Category.find({name:body.name})
        if(search.length!=0){
            return res.status(404).json({ error:"category already present" })
        }
        const category = await Category.findByIdAndUpdate( id, body, { new: true} )
        res.status(200).json(category)
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error'})
    }
}

categoryCltrs.remove = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findByIdAndDelete(id)
        res.status(200).json(category)
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error'})
    }
}



categoryCltrs.category = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id)
        res.json(category)
    } catch {
        res.status(400).json({ error: 'something went wrong'})
    }
}

module.exports = categoryCltrs