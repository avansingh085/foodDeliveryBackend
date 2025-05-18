const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('../schema/Users.js');
const Orders=require('../schema/Orders.js');
const Payment=require('../schema/Payment.js');
const addOrder = async (req, res) => {
   
    try {
      const { mobile, paymentId, amount } = req.body;
  
      if (!mobile) {
        return res.status(400).json({ message: "Invalid data", success: false });
      }
  
      const user = await Users.findOne({ mobile }).populate("cart.id");
      if (!user) {
        return res.status(404).json({ message: "Invalid user", success: false });
      }
  
      const cartItems = user.cart;
 
     
      const orderIds = await Promise.all(
        cartItems.map(async (item) => {
        
          const newOrder = new Orders({
            id: item.id.id,
            price: item.id.price,
            quantity: item.quantity,
            deliveryLocation:item.deliveryLocation,
            customization: item.customization,
            totalPrice: item.totalPrice,
          });
          await newOrder.save();
          return newOrder._id;
        })
      );
      user.Orders.push(...orderIds);
  
      const newPayment = new Payment({ paymentId, amount });
      await newPayment.save();
      user.paymentHistory.push(newPayment._id);
     user.cart=[];
    
      await user.save();
  
      return res
        .status(200)
        .json({ message: "Delivery status successfully updated", success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error occurred during delivery status updating",
        success: false,
      });
    }
  };
  

  const getOrder = async (req, res) => {
    console.log("hellow");
    try {
      const { mobile } = req.user;
  
      if (!mobile) {
        return res.status(400).json({ message: "Invalid mobile number", success: false });
      }
  
      // Retrieve the user and populate the 'Orders' field
      const user = await Users.findOne({ mobile }).populate({
        path: 'Orders',
        populate: {
          path: 'id', // Assuming 'id' in Orders refers to the Product
          model: 'Product'
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist", success: false });
      }
  
      const orderData = user.Orders;
 
      return res.status(200).json({
        message: "Your order data was successfully fetched",
        success: true,
        orders: orderData
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "An error occurred while fetching order data",
        success: false
      });
    }
  };
  const getIncomingOrder = async (req, res) => {
    try {
        let data = await Orders.find({
            statusSteps: { 
                  completed: false 
            }
        });
  
    } catch (err) {
        console.error("Error fetching incoming orders:", err);
      
    }
  };
  module.exports={getOrder,addOrder,getIncomingOrder}
  
