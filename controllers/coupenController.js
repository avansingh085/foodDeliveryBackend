const dotenv = require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const Users=require('../schema/Users.js');
const Product=require('../schema/Product.js')
const Orders=require('../schema/Orders.js');
const Payment=require('../schema/Payment.js');
const jwt = require('jsonwebtoken');
const Reviews=require('../schema/Review.js');
