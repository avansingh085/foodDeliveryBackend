const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('./schema/Users.js');
const Product=require('./schema/Product.js')
const Orders=require('./schema/Orders.js');
const Payment=require('./schema/Payment.js');
const jwt = require('jsonwebtoken');
const Reviews=require('./schema/Review.js');
const login = async (req, res) => {
    const { mobile } = req.body;
    try {
       
        if (!mobile) {
            return res.status(400).json({ data: { message: 'Mobile number is required' } });
        }

        let user = await Users.findOne({ mobile });
        if (!user) {
            
            user = new Users({ mobile });
            await user.save(); 
        }
        const token = jwt.sign({ mobile }, process.env.SECRET_KEY, { expiresIn: '380h' });
       return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        console.error('Error during login:', err);
       return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const addNewFood=async (req,res)=>{
    try{
       // console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
        let data=req.body;
     
      let newProduct=new Product(data);
       await newProduct.save();
      return res.status(200).send({message:"new product successfully added",success:true});
    }
    catch(err)
    {
       return res.status(501).send({message:"err occur during product insert"});

    }
}

const authenticateToken=async (req, res, next)=> {
    const token = req.headers['authorization'];
 
    if (!token) return res.status(401).json({ message: 'Access denied' });
   
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
     
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
         
        next();
    });
}
const userData = async (req, res) => {
    try {
      
        const user = await Users.findOne({ mobile: req.user.mobile }).lean(); 
        if (!User) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({
            message: 'Profile data retrieved successfully',
            user,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const getFood=async (req,res)=>{
    try{
    let {id}=req.params;
       console.log(id)
       if(!id)
        return res.status(500).send({message:"ivalid product id",success:false});
       let isExist=await Product.findOne({_id:id}).populate('reviews');
      
       if(!isExist)
       return res.status(400).send({message:"product not exist",success:false});
   
        return res.status(200).send({message:"product item successfully fetched",success:true,item:isExist})
    }catch(err)
    {
        console.log(err)
        return res.status(501).send({message:"error occur during product fetch",success:false});
    }
}
const deleteCart=  async (req, res) => {
    let { mobile, id } = req.body;
    id=id._id;
  
    if (!mobile || !id) {
        return res.status(400).json({ message: 'Mobile number and item ID are required' });
    }
    try {
        const user = await Users.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.cart = user.cart.filter((item)=>item.id!=id);
        
        await user.save();
    
      return  res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.log(error)
       return res.status(500).json({ message: 'Server error', error });
    }
}
const updateCart = async (req, res) => {
    const { mobile, id, quantity } = req.body;
    if (!mobile || !id || !quantity) {
      return res.status(400).json({ message: 'Mobile number, item ID, and quantity are required' });
    }
  
    try {
     
      const user = await Users.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.cart = User.cart.map((item) => {
        if (item.id === id) {
          item.quantity = quantity; 
        }
        return item; 
      });
  
      await user.save();
  
      return res.status(200).json({ message: 'Item quantity updated', user: user });
    } catch (error) {
      console.error('Error updating cart:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  };
  
const addCart=async (req, res) => {
    const { mobile, item } = req.body;
   console.log(item);
    if (!mobile || !item) {
        return res.status(400).json({ message: 'Mobile number and item details are required' });
    }

    try {
        const user = await Users.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.cart.push(item);

        await user.save();
      
      return  res.status(200).json({ message: 'Item added to cart', user: user });
    } catch (error) {
        console.log(error)
      return  res.status(500).json({ message: 'Server error', error });
    }
}
const getCart=async (req,res)=>{
    try
    {
        let mobile =req.user.mobile;
        console.log(req.user,req.query)
           if(!mobile)
            return res.status(501).send({message:"invalid user ",success:false});
         let isExist=await Users.findOne({mobile});
      
         if(!isExist)
         {
           
            return res.status(501).send({message:"invalid user ",success:false});
         }
         let cart=(await Users.findOne({mobile}).populate('cart.id').lean()).cart
     cart= await cart.map((data)=>({...data,...data.id}));

       
    return res.status(200).send({message:"cart data successfully send",success:true,cart});

    }catch(err){
        console.log(err)
      return res.status(500).send({message:"err during getCart",success:false});
    }
}
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
  
const getMenu=async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;
  
      const items = await Product.find().skip(skip).limit(limit);
      const totalItems = await Product.countDocuments();
  
    return  res.status(200).send({success:true, items, totalPages: Math.ceil(totalItems / limit) });
    } catch (error) {
     return res.status(500).json({ error: "Failed to fetch menu." });
    }
  };
const sendOtp=(req, res) => {
      const { phone } = req.body;
      if (!phone) {
          return res.status(400).send({ message: 'Phone number is required' });
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      client.messages
          .create({
              body: `Your OTP is  ${otp}`,
              messagingServiceSid:process.env.messagingServiceSid||'MG17f4a1bd1e1f8f81f5b87905d1ffae6f',
              to: phone,
          })
          .then(() => {
              otpStore[phone] = otp; 
              console.log(`OTP sent to ${phone}: ${otp}`);
              res.status(200).send({ message: 'OTP sent successfully' });
          })
          .catch((error) => {
              console.error(error);
              res.status(500).send({ message: 'Failed to send OTP', error });
          });
  }
  const addReview = async (req, res) => {
    try {
        const { comment, rating, orderId, productId } = req.body;
        const mobile = req.user.mobile;
        console.log("Request body:", req.body, mobile);

        // Validate required fields
        if (!orderId|| !rating) {
            return res.status(400).send({ message: "Invalid data", success: false });
        }

       
        const isExistUser = await Users.findOne({ mobile });
        if (!isExistUser) {
          console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
            return res.status(400).send({ message: "Invalid user", success: false });
        }

        const photos = req.files ? req.files.map(file => file.path) : [];
  console.log(photos,"VABNNA")
      
        let newReview = new Reviews({ mobile, orderId, rating, comment,productId, photos });
        await newReview.save();

        console.log("New Review:", newReview);

        
        let isExistProduct = await Product.findOne({_id:productId});
        if (!isExistProduct) {
          console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
            return res.status(400).send({ message: "Invalid product ID", success: false });
        }

       
        isExistProduct.reviews.push(newReview._id);
        await isExistProduct.save();

        return res.status(200).send({ message: "Review successfully added", success: true });

    } catch (err) {
        console.error("Error during review creation:", err);
        return res.status(500).send({ message: "Error occurred during review creation", success: false });
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

  
module.exports={addReview,getFood,login,addCart,updateCart,deleteCart,authenticateToken,userData,addOrder,getOrder,addNewFood,getMenu,getCart};