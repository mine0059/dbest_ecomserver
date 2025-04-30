const {validationResult} = require('express-validator');
const User = require('../models/user.model');
const {Token} = require('../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => (
            {
                field: error.path, 
                message: error.msg
            }
        ));
        return res.status(400).json({errors: errorMessages});
    }
    try {
        let user = new User({
           ...req.body,
           password: bcrypt.hashSync(req.body.password, 8),
        });

        user = await user.save();
        if (!user) {
            return res.status(500).json({type: 'Internal Seerver Error', message: 'User registration failed'});
        }
        return res.status(201).json(user);
    } catch (error) {
        if (error.message.includes('email_1 dup key')) {
            return res.status(409).json({
                type: 'AuthError', 
                message: 'User with this email already exists'
            });
        }
        return res.status(500).json({type: error.name, message: error.message});
    }
};

const login = async (req, res) => {
   try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({message: 'User not found\nCheck your email and try again.'});
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({message: 'Incorrect password!'});
    }
    const accessToken = jwt.sign(
        {id: user.id, isAdmin: user.isAdmin},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '24h'},
    );

    const refreshToken = jwt.sign(
        {id: user.id, isAdmin: user.isAdmin},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '60d'},
    );

    const token = await Token.findOne({userId: user.id});
    if (token) await token.deleteOne();
    await new Token({
        userId: user.id, 
        accessToken, 
        refreshToken
    }).save();

    user.password = undefined;
    return res.status(200).json({
        ...user._doc,
        accessToken,
    });
   } catch (error) {
    return res.status(500).json({type: error.name, message: error.message});
   }
};

const verifyToken = async (req, res) => {
    try {
      let accessToken = req.headers.authorization;
      if (!accessToken) return res.json(false);
      accessToken = accessToken.replace('Bearer ', '').trim();

      const token = await Token.findOne({accessToken});
      if (!token) return res.json(false);

      const tokenData = jwt.decode(token.refreshToken);

      const user = await User.findById(tokenData.id);
      if (!user) return res.json(false);

      const isValid = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!isValid) return res.json(false);
      return res.json(true);
    } catch (error) {
      return res.status(500).json({type: error.name, message: error.message});
    }
}

// const forgotPassword = async (req, res) => {};
// const verifyPasswordResetOTP = async () => {};
// const resetPassword = async () => {};

module.exports = {
    register,
    login,
    verifyToken,
}