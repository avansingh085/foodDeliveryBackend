const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const users=require('./schema/userSchema.js');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { mobile } = req.body;
  console.log(mobile,"PPPPPPPPPPPPPPPPP")
    try {
       
        if (!mobile) {
            return res.status(400).json({ data: { message: 'Mobile number is required' } });
        }

        let user = await users.findOne({ mobile });
        if (!user) {
            
            user = new users({ mobile });
            await user.save(); 
        }
        console.log(user,"OPPPPPPPPPPPPPPPPPPPP")
        
        const token = jwt.sign({ mobile }, process.env.SECRET_KEY, { expiresIn: '380h' });

       return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        console.error('Error during login:', err);
       return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};


const authenticateToken=async (req, res, next)=> {
    const token = req.headers['authorization'];
  
    if (!token) return res.status(401).json({ message: 'Access denied' });
   
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
       
        next();
    });
}
const profile = async (req, res) => {
    try {
    
        const User = await users.findOne({ mobile: req.user.mobile }).lean(); 
        if (!User) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({
            message: 'Profile data retrieved successfully',
            User,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const deleteCart=  async (req, res) => {
    const { mobile, id } = req.body;
   
    if (!mobile || !id) {
        return res.status(400).json({ message: 'Mobile number and item ID are required' });
    }
    try {
        const user = await users.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter((item)=>item.id!==id);
        await user.save();
      return  res.status(200).json({ message: 'Item removed from cart', user: user });
    } catch (error) {
       return res.status(500).json({ message: 'Server error', error });
    }
}
const updateCart = async (req, res) => {
    const { mobile, id, quantity } = req.body;
    if (!mobile || !id || !quantity) {
      return res.status(400).json({ message: 'Mobile number, item ID, and quantity are required' });
    }
  
    try {
     
      const user = await users.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.cart = user.cart.map((item) => {
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
   
    if (!mobile || !item) {
        return res.status(400).json({ message: 'Mobile number and item details are required' });
    }

    try {
        const user = await users.findOne({ mobile });
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

const payment=async (req, res) => {
    const { mobile, payment } = req.body;
    if (!mobile || !payment) {
        return res.status(400).json({ message: 'Mobile number and payment details are required' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.paymentHistory.push(payment);
        await user.save();
        res.status(200).json({ message: 'Payment recorded', paymentHistory: user.paymentHistory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
const updateOrderStatus=async (req,res)=>{
    console.log(req.body)
    try{
         let {mobile,cartItems,paymentId}=req.body;
         console.log(mobile,paymentId);
        if(!mobile||!cartItems||!paymentId)
        {
            return res.status(501).send({message:"invalid data",success:false});
    }
         let user=await users.findOne({mobile});
         if(!user)
            return res.status(401).send({message:"invalid user",success:false});
            user.cart=[];
            await user.save();
            cartItems.map((d,key)=>{
                user.deliveryStatus.push({...d,paymentId})
            })
           
          await user.save();
        return res.status(200).send({message:"delivery status successfully update",success:true});

    }catch(err){
        console.log(err);
        return res.status(500).send({message:"error ocuur during delivery status updating",success:false});
    }
}
const updatePaymentHistory=async (req,res)=>{
    try{
      let {paymentId,amount,mobile}=req.body;
      let user=await users.findOne({mobile});
      if(!user)
         return res.status(401).send({message:"invalid user",success:false});
       user.paymentHistory.push({paymentId,amount});
      await user.save();
    return res.status(200).send({message:"payment history updated successfully",success:true});
    }catch(err){
        return res.status(200).send({message:"fail to update payment history",success:false});
    }
}
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
  
module.exports={login,payment,addCart,updateCart,deleteCart,authenticateToken,profile,updateOrderStatus,updatePaymentHistory}