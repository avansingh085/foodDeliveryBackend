const dotenv = require('dotenv');
dotenv.config();

const Product=require('../schema/Product.js')
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
  module.exports={addNewFood,getFood,getMenu};