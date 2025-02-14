const mongoose = require('mongoose');
const cartItemSchema=require('./cartItemSchema');
const userSchema = new mongoose.Schema({
  mobile: { 
    type: String, 
    required: true, 
    unique: true,
    
  },
  role: {
    type: String,
    enum: ["User", "Admin", "Delivery"],
    default: "User",
  },
  cart: [cartItemSchema],
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  Orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
});
 userSchema.index({ 'Orders.currentStatus': 1 });
 userSchema.index({ 'paymentHistory.paymentId': 1 });
const Users = mongoose.model('Users', userSchema);

module.exports = Users;