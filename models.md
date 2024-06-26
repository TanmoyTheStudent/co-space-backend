  ## users model
  -- _id
  -- userName
  -- password
  -- role

  ## property model
  --_id 
  --address
  --name
  --location
  --capacity
  --status:[available,occupied]
  --isApproved:false //admin's approval is needed
  --amenities Available:[aminities objectId]

  ## space model
  --officeId:schema.type.ObjectId
  --servicesId: schema.type.ObjectId
  --type:[daily,monthly,yearly]
  --price:[$daily,$monthly,$yearly]
  --Available quantity
  --isOccupied:[available,occupied]
  --rating
  --Free aminities:[aminities ObjectId]
  --image

  ## services model
  -- service : "string"
  --  options:[open seat,dedicated seat,private cabin,meeting room, eventspace]

   ## Amenities model
  -- Title: "string"
  -- Charge: Number

  ## Booking model/ Invoice
  --userId
  --spaceId
  --propertyId
  --quantity
  --Extra aminities:[aminities ObjectId]
  --TotalAmount
  --status-["booked","pending"]
  --isInvoice: false
  --modeOfPayment:[cash,online]

  ## Member Details:
  -- user Id
  -- Image
  -- Personal details:{fullname:"",
                       full Address:"",
                       occupation:"",
                       purpose:"",
                       PAN card:"",
                       One Bank Account No:"",
                       Document No:""}
  -- Booking History:[Booking Id]
  -- Preferences:[spaceId]
  -- Recommendation: [spaceId]
  
  ## Enquiry and Recommendation
 -- user Id
 -- Enquiry content
 -- enquiry based on:[space id]
 -- Recommendation content:[space Id]
  

  ## Payment model

 

  ## message model



## Q) Role? - do we need any middle party?




**Done by Sir**

## users model
  -- _id
  -- userName
  -- password
  -- role

  ## property model
  --_id
  --address
  --name
  --location
  --capacity
  --status:[available,occupied]
  --isApproved:false //admin's approval is needed
  --amenities Available:[aminities objectId]

  ## Category model
  -- name : "string"
  --  options:[open seat,dedicated seat,private cabin,meeting room, eventspace]


  ## space model
  --officeId:schema.type.ObjectId
  --categoryId: schema.type.ObjectId
  --type:[{ name: 'daily', price: '' }{ name: 'monthly', price: '' }]
  --Available quantity
  --isOccupied:[available,occupied]
  --rating
  --Free aminities:[aminities ObjectId]
  --image

   ## Amenities model
  -- Title: "string"
  -- Charge: Number

  ## Booking model/ Invoice
  --userId
  --spaceId
  --spaceTypeId 
  --propertyId
  --quantity
  --Extra aminities:[aminities ObjectId]
  --TotalAmount
  --status-["booked","pending"]
  
  ## Member Details:
  -- user Id
  -- Image
  -- Personal details:{fullname:"",
                       full Address:"",
                       occupation:"",
                       purpose:"",
                       PAN card:"",
                       One Bank Account No:"",
                       Document No:""}
  -- Booking History:[Booking Id]
  -- Preferences:[spaceId]
  -- Recommendation: [spaceId]
  
  ## Payment model
    bookingId
    transactionid
    amount
    customerId
    paymentType
    paymentStatus 


  ## Review
    customerId
    propertyId
    rating
    review 




Space -> review 
const review = new Review(body)
await review.save() 
const property = await Property.findById(review.propertyId)
property.rating = computeLogic
await property.save() 

.save() -> isNew property


