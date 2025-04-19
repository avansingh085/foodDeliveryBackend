const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  statusSteps: [
    {
      step: {
        type: String,
        enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
        default: "Order Placed"
      },
      date: { 
        type: Date, 
        default: Date.now 
      },
      completed: { 
        type: Boolean, 
        default: false 
      }
    }
  ],
  currentStatus: {
    type: String,
    enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
    default: "Order Placed",
    index: true 
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be at least 0.01'],
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
  quantity:{
    type:Number,
    default:1,
  }, 
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Cash"],
    default: "Paid"
  }
});
const Orders =  mongoose.model('Order', OrderSchema);

module.exports = Orders;
