const mongoose=require('mongoose');
const cartItemSchema = new mongoose.Schema({
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: [1, 'Quantity cannot be less than 1']
  },
  customization: {
    size: { 
      type: String, 
      enum: ["Small", "Medium", "Large"], 
      
    },
    crust: { 
      type: String, 
      enum: ["Classic", "Thin Crust", "Cheese Burst"], 
      default:"Classic",
    },
    extraCheese: { 
      type: Boolean, 
      default: false 
    },
    toppings: [{ 
      type: String,
      default: []  
    }],
    
    sugar: { 
      type: String, 
      default: "" 
    }
  },
  totalPrice:{
    type:Number,
    default:0
  },
  deliveryLocation:{
    latitude:{
      type:Number
    },
    longitude:{
      type:Number
    }
  },
}, { _id: false });  
module.exports=cartItemSchema;