const mongoose=require('mongoose');
const db=()=>{
    try{
       mongoose.connect("mongodb://127.0.0.1:27017/fooddb")
         .then(() => console.log("MongoDB connected"))
         .catch(err => console.error("MongoDB connection error:", err));
    }
    catch(err){
        console.log("data bace connection error");
    }
}
module.exports=db;