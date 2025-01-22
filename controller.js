 const sign_up=async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const userExists = users.find(user => user.mobile === mobile);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ mobile });
    res.status(201).json({ message: 'Signup successful' });
 }


 const login=async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const user = users.find(user => user.mobile === mobile);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ mobile }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
}



const authenticateToken=async (req, res, next)=> {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

const profile =async  (req, res) => {
    const user = users.find(user => user.mobile === req.user.mobile);
    res.status(200).json({ message: 'Profile data', user });
};

const deleteCart=  async (req, res) => {
    const { mobile, itemId } = req.body;
    if (!mobile || !itemId) {
        return res.status(400).json({ message: 'Mobile number and item ID are required' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.itemId !== itemId);
        await user.save();
        res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const addCart=async (req, res) => {
    const { mobile, item } = req.body;
    if (!mobile || !item) {
        return res.status(400).json({ message: 'Mobile number and item details are required' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart.push(item);
        await user.save();
        res.status(200).json({ message: 'Item added to cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const payment=async (req, res) => {
    const { mobile, payment } = req.body;
    if (!mobile || !payment) {
        return res.status(400).json({ message: 'Mobile number and payment details are required' });
    }

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.paymentHistory.push(payment);
        await user.save();
        res.status(200).json({ message: 'Payment recorded', paymentHistory: user.paymentHistory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports={login,payment,addCart,deleteCart,authenticateToken,sign_up}