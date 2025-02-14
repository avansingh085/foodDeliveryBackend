const mongoose=require('mongoose');
const db=()=>{
    try{
   let url1="mongodb+srv://adityavishwakarma9025:ALnl1qBnxLrI05PO@cluster0.s4vzk.mongodb.net";
   let url2="mongodb+srv://avansingh085:SbhUyHjWETMpJWUN@cluster0.tyyrk.mongodb.net";
      //  mongodb+srv://adityavishwakarma9025:ALnl1qBnxLrI05PO@cluster0.s4vzk.mongodb.net/imageGalleria-db?retryWrites=true&w=majority&appName=Cluster0
       mongoose.connect(`${url2}/fooddb`)
         .then(() => console.log("MongoDB connected"))
         .catch(err => console.error("MongoDB connection error:", err));
    }
    catch(err){
        console.log("data bace connection error",err);
    }
}

module.exports=db;