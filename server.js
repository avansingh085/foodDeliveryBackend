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
const port = 5000;
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const {authenticateToken, profile}=require("./controller");


app.use("/uploads", express.static("uploads"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/foodRoutes"));
app.use("/", require("./routes/cartRoutes"));
app.use("/", require("./routes/orderRoutes"));
app.use("/", require("./routes/reviewRoutes"));
app.use("/", require("./routes/uploadRoutes"));

  
app.get('/profile', authenticateToken, profile);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
