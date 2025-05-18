const mongoose=require('mongoose');
const db=()=>{
    try{
  
   let url="mongodb+srv://avansingh085:SbhUyHjWETMpJWUN@cluster0.tyyrk.mongodb.net";
       mongoose.connect(`${url}/fooddb`)
         .then(() => console.log("MongoDB connected"))
         .catch(err => console.error("MongoDB connection error:", err));
    }
    catch(err){
        console.log("data bace connection error",err);
    }
}

module.exports=db;