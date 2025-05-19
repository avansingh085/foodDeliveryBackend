const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('../schema/Users.js');
const deleteCart=  async (req, res) => {
  
  try {  let { mobile, id } = req.body;
  
    if (!mobile || !id) {
        return res.status(400).json({ message: 'Mobile number and item ID are required' });
    }
    
        const user = await Users.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cart=user.cart;
        const newCart= cart?.filter((item)=>String(item.id)!==String(id));
        user.cart=newCart;
        await user.save();
        
      return  res.status(200).json({ message: 'Item removed from cart' ,user});
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
      const cart=user.cart;
     const updatedCart = cart.map((item) => {
  if (String(item.id) === String(id)) {
    return { ...item, quantity }; 
  }
  return item;
});

user.cart = updatedCart;
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
     cart= await cart?.map((data)=>({...data,...data.id}));

       
    return res.status(200).send({message:"cart data successfully send",success:true,cart});

    }catch(err){
        console.log(err)
      return res.status(500).send({message:"err during getCart",success:false});
    }
}

module.exports={getCart,updateCart,deleteCart,addCart};
