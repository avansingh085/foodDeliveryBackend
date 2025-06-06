const dotenv=require('dotenv');
dotenv.config();
const jwt=require('jsonwebtoken');
const authenticateToken=async (req, res, next)=> {
    const token = req.headers['authorization'];
 
    if (!token) return res.status(401).json({ message: 'Access denied' });
   
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
     
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
         
        next();
    });
}

module.exports=authenticateToken;