const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Order schema definition
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
