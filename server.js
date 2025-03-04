const express = require("express");
const multer = require("multer");
require('dotenv').config();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const db=require('./database');
db();
const Users=require('./schema/Users');
const accountSid =process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilio=require('twilio');
const {addReview,getFood,profile,login,authenticateToken,addCart,updateCart,deleteCart,addOrder,getOrder,addNewFood,getMenu,getCart}=require('./controller');

const port = 5000;
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
let otpStore={};
//const users=require('./schema/userSchema.js');
console.log(process.env.accountSid)

const client = require('twilio')(accountSid,authToken);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname); 
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const imageSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
});
const Image = mongoose.model("Image", imageSchema);
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  const newImage = new Image({
    name: req.body.name || "Unnamed Image",
    description: req.body.description || "No description provided",
    imageUrl,
  });

  await newImage.save();

  res.status(200).json({ imageUrl });
});
app.use("/uploads", express.static("uploads"));
app.get("/getMenu",getMenu);
app.get("/getCart",authenticateToken,getCart);
app.post("/addCart",addCart);
app.post('/login',login);
app.get("/food/:id",getFood);
app.post("/updateCart",updateCart)
app.post("/deleteCart",deleteCart);
app.post("/addOrder",addOrder);
app.post("/addReview",authenticateToken,upload.array('capturedImages', 5),addReview);
app.get("/getOrder",authenticateToken,getOrder);
app.post("/addNewFood",addNewFood);
app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

    app.post('/send-otp', (req, res) => {
      const { phone } = req.body;
      return  res.status(200).send({ message: 'OTP sent successfully' });
      if (!phone) {
          return res.status(400).send({ message: 'Phone number is required' });
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      client.messages
          .create({
              body: `Your OTP is  ${otp}`,
              messagingServiceSid:process.env.MESSAGING_SERVICE_ID,
              to: phone,
          })
          .then(() => {
              otpStore[phone] = otp; 
              console.log(`OTP sent to ${phone}: ${otp}`);
            return  res.status(200).send({ message: 'OTP sent successfully' });
          })
          .catch((error) => {
              console.error(error);
             return res.status(500).send({ message: 'Failed to send OTP', error });
          });
  });

  
  app.post('/verify-otp', async (req, res) => {
      const { phone, otp } = req.body;
      console.log(phone,otp,"veri",otpStore[phone])
      if (!phone || !otp) {
        return res.status(400).send({ message: 'Phone number and OTP are required' });
    }
     let data= await Users.findOne({mobile:phone});
      return res.status(200).send({ message: 'OTP verified successfully',success:true ,user:data});
     console.log(phone,otp,"veri",otpStore[phone])
     
      if (otpStore[phone] && otpStore[phone] == otp) {
          delete otpStore[phone];
         
         return res.status(200).send({ message: 'OTP verified successfully',success:true });
      } else {
         return res.status(400).send({ message: 'Invalid OTP or OTP expired',success:false });
      }
  });
  
app.get('/profile', authenticateToken, profile);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
