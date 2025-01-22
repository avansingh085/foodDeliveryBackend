const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const {profile,login,authenticateToken,sign_up}=require('./controller');
const app = express();
const port = 5000;
app.use(cors()); 
app.use(express.json());

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
mongoose.connect("mongodb://127.0.0.1:27017/fooddb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
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
app.post('/signup', signup);
app.post('/login',login);
app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/profile', authenticateToken, profile);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
