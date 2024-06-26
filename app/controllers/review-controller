const { validationResult } = require('express-validator');
const Review = require("../models/review-model");
const Space = require("../models/space-model");
const reviewCltrs = {};

reviewCltrs.create = async (req,res) => {
    
    const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        
        try {
            const body = req.body
            //console.log("body",body)
            body.user=req.user.id

            //find whether the user had already given a review for this space
            const findReview= await Review.find({user:req.user.id,space:body.space})
            if(findReview.length!=0){
                return res.status(404).json({ error:"already review given by you for this space" })
            }
            const review= await Review.create(body)

            //calculate avg rating of the space
            const space= await Space.findById(body.space)
            const totalReviews= await Review.countDocuments({ space:body.space })

            const newAvgRating=((space.avgRating*totalReviews)+body.rating)/(totalReviews+1)

            space.avgRating=newAvgRating
            await space.save()


            res.status(201).json(review)
        } catch(err) {
            console.log(err)
            res.status(500).json({ error: 'Internal server error'})
        }
};

reviewCltrs.list = async (req,res) => {
    //console.log("/////////I am in reviewCltrs.list///////// ")
    try {
        const space = req.params.id
        const reviews = await Review.find({space:space}).sort({createdAt:-1}).populate("user")
        res.status(200).json(reviews)
    } catch(err) {
        res.status(500).json({ error: 'Internal server error'})
    }
};


reviewCltrs.singleclient = async (req,res) => {
   // console.log("i am in single client")
    try {
       // const space = req.params.id
        const reviews = await Review.find({user:req.user.id}).sort({createdAt:-1})
        //console.log("reviews in single Client",reviews)
        res.status(200).json(reviews)
    } catch(err) {
        //console.log("error in singleClient",err)
        res.status(500).json({ error:  'Internal server error'})
    }
}

reviewCltrs.update = async (req,res) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

    try {
        const id = req.params.id
        const body = req.body
        const previousReview=await Review.findById(id)
        const review = await Review.findByIdAndUpdate( id, body, { new: true} )

        //calculate avg rating of the space
        const space= await Space.findById(body.space)
        const totalReviews= await Review.countDocuments({ space:body.space })

        const newAvgRating=((space.avgRating*totalReviews)-previousReview.rating+body.rating)/(totalReviews)

        space.avgRating=newAvgRating
        await space.save()

        res.status(200).json(review)
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}


reviewCltrs.remove = async (req,res) => {
    try {
        const reviewId = req.params.id
        const spaceId=req.params.spaceId
        const previousReview=await Review.findById(reviewId)
        const review = await Review.findByIdAndDelete(reviewId)

         //calculate avg rating of the space
         const space= await Space.find({_id:spaceId})
         const totalReviews= await Review.countDocuments({ space:spaceId })
        
         if(totalReviews>0){
         const newAvgRating=((space.avgRating*totalReviews)-previousReview.rating)/(totalReviews)
 
         space.avgRating=newAvgRating
         }else{
            space.avgRating=0  
         }
         await space.save()

        res.status(200).json(review)
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

module.exports=reviewCltrs

