const User = require('../models/user.model');

const getUsers = async (_, res) => {
    try {
        const users = await User.find().select('name email id isAdmin');
        if (!users) {
            return res.status(404).json({message: 'Users not found'});
        }
        console.log(users);
        
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -resetPasswordOtp -resetPasswordOtpExpires -cart');
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
         console.log(user);
         return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const updateUser = async (req, res) => {
    try {
        const {name, email, phone} = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {name, email, phone},
            {new: true},
        );

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        user.password = undefined;
        user.cart = undefined;
        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

module.exports = {
    getUsers,
    getUserById,
    updateUser,
}