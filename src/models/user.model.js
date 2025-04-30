const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    street:String,
    city:String,
    postalCode:String,
    country:String,
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    isAdmin: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    resetPasswordOtp: Number,
    resetPasswordOtpExpires: Date,
    wishList: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            productImage: {
                type: String,
                required: true,
            },
            productPrice: {
                type: Number,
                required: true,
            },
        },
    ],
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
module.exports = User;