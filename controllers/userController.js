const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('../schema/Users.js');
const userData = async (req, res) => {
    try {
      
        const user = await Users.findOne({ mobile: req.user.mobile }).lean(); 
        if (!User) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({
            message: 'Profile data retrieved successfully',
            user,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports={userData}