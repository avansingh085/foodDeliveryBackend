const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('../schema/Users.js');
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
    const { mobile } = req.body;
    try {
       
        if (!mobile) {
            return res.status(400).json({ data: { message: 'Mobile number is required' } });
        }

        let user = await Users.findOne({ mobile });
        if (!user) {
            
            user = new Users({ mobile });
            await user.save(); 
        }
        const token = jwt.sign({ mobile }, process.env.SECRET_KEY, { expiresIn: '380h' });
       return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        console.error('Error during login:', err);
       return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

module.exports={login};