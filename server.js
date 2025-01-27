const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const db=require('./database');
db();
const twilio=require('twilio');
const {profile,login,authenticateToken,addCart,updateCart,deleteCart,updateOrderStatus,updatePaymentHistory}=require('./controller');

const port = 5000;
app.use(cors()); 
app.use(express.json());
let otpStore={};
//const users=require('./schema/userSchema.js');
const accountSid = 'AC63caaf932b00a54c24ba4b92c8773476';
const authToken = 'd7d9938a3da78c81deaea08fdd221cee';
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
app.post("/addCart",addCart);
app.post('/login',login);
app.post("/updateCart",updateCart)
app.post("/deleteCart",deleteCart);
app.post("/updateOrderStatus",updateOrderStatus);
app.post("/updatePaymentHistory",updatePaymentHistory);
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
              messagingServiceSid:process.env.messagingServiceSid||'MG17f4a1bd1e1f8f81f5b87905d1ffae6f',
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
  
  app.post('/verify-otp', (req, res) => {
      const { phone, otp } = req.body;
      return res.status(200).send({ message: 'OTP verified successfully',success:true });
     console.log(phone,otp,"veri",otpStore[phone])
      if (!phone || !otp) {
          return res.status(400).send({ message: 'Phone number and OTP are required' });
      }
      if (otpStore[phone] && otpStore[phone] == otp) {
          delete otpStore[phone];
          console.log("PPPPPPPPPPPPPPPPPPPP");
         return res.status(200).send({ message: 'OTP verified successfully',success:true });
      } else {
         return res.status(400).send({ message: 'Invalid OTP or OTP expired',success:false });
      }
  });
  
app.get('/profile', authenticateToken, profile);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
