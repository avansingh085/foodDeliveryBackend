const mongoose=require('mongoose');
const db=()=>{
    try{
       mongoose.connect("mongodb+srv://avansingh085:SbhUyHjWETMpJWUN@cluster0.tyyrk.mongodb.net/Ecommerce")
         .then(() => console.log("MongoDB connected"))
         .catch(err => console.error("MongoDB connection error:", err));
    }
    catch(err){
        console.log("data bace connection error");
    }
}
module.exports=db;