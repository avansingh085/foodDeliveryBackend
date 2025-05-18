const express = require("express");
const router = express.Router();
const Users = require("../schema/Users.js");
const { login } = require("../controllers/authController.js");
const twilio=require('twilio');
const accountSid =process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid,authToken);


let otpStore = {};
router.post("/login", login);



router.post("/logout", (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});



router.post('/send-otp', (req, res) => {
    const { phone } = req.body;
    return res.status(200).send({ message: 'OTP sent successfully' });
    if (!phone) {
        return res.status(400).send({ message: 'Phone number is required' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    client.messages
        .create({
            body: `Your OTP is  ${otp}`,
            messagingServiceSid: process.env.MESSAGING_SERVICE_ID,
            to: phone,
        })
        .then(() => {
            otpStore[phone] = otp;
            console.log(`OTP sent to ${phone}: ${otp}`);
            return res.status(200).send({ message: 'OTP sent successfully' });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send({ message: 'Failed to send OTP', error });
        });
});



router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    console.log(phone, otp, "veri", otpStore[phone])
    if (!phone || !otp) {
        return res.status(400).send({ message: 'Phone number and OTP are required' });
    }
    let data = await Users.findOne({ mobile: phone });
    return res.status(200).send({ message: 'OTP verified successfully', success: true, user: data });
    console.log(phone, otp, "veri", otpStore[phone])

    if (otpStore[phone] && otpStore[phone] == otp) {
        delete otpStore[phone];

        return res.status(200).send({ message: 'OTP verified successfully', success: true });
    } else {
        return res.status(400).send({ message: 'Invalid OTP or OTP expired', success: false });
    }
});


module.exports = router;