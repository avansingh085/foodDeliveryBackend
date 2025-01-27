const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, default:1,trim:true },
  price: { type: Number, required: true },
  description:{type:String,trim:true},
  image:{type:String,required:true},

  customization: {
    size: { type: String, enum: ["Small", "Medium", "Large"], required: true },
    crust: { type: String, enum: ["Classic", "Thin Crust", "Cheese Burst"], required: true },
    extraCheese: { type: Boolean, default: false },
    toppings: [{ type: String ,default:""}], 
    sugar:{type:String,default:""}
  },
});
const paymentHistorySchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const deliveryStatusSchema = new mongoose.Schema(
  {
   
  name: { type: String, required: true },
  quantity: { type: Number, default:1,trim:true },
  price: { type: Number, required: true },
  description:{type:String,trim:true},
  image:{type:String,required:true},

  customization: {
    size: { type: String, enum: ["Small", "Medium", "Large"], default:"Medium" },
    crust: { type: String, enum: ["Classic", "Thin Crust", "Cheese Burst"], default:"Thin Crust" },
    extraCheese: { type: Boolean, default: false },
    toppings: [{ type: String ,default:""}], 
    sugar:{type:String,default:""}
  },
    statusSteps: [
      {
        step: {
          type: String,
          enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
          default:"Order Placed",
        },
        date: { type: Date, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending","Cash"],
      default: "Paid",
    },
    paymentId:{
      type:String,
      default:""
    }
  }
);

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["User", "Admin", "Delivery"],
    default:"User",
    required: true,
  },
  cart: [cartItemSchema],
  paymentHistory: [paymentHistorySchema], 
  deliveryStatus: [deliveryStatusSchema],
});
const Users = mongoose.model('Users', userSchema);

module.exports = Users;
