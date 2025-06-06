const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const db=require('./lib/database');
db();
const port = 5000;
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authenticateToken=require("./middilwares/auth.middilwares");
const Users = require("./schema/Users");


app.use("/uploads", express.static("uploads"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/foodRoutes"));
app.use("/", require("./routes/cartRoutes"));
app.use("/", require("./routes/orderRoutes"));
app.use("/", require("./routes/reviewRoutes"));
app.use("/", require("./routes/uploadRoutes"));

  
app.get('/profile', authenticateToken,async (req,res)=>{
let user=await Users.findOne({mobile:req?.user?.mobile});
  return res.status(200).send({user,success:true})
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
