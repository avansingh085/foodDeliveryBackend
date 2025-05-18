const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('../schema/Users.js');
const Product=require('../schema/Product.js')
const Reviews=require('../schema/Review.js');
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


  
module.exports={addReview};