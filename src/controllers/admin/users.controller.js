const User = require("../../models/user.model");
const Order = require("../../models/order");
const OrderItem = require("../../models/order_items");
const CartProduct = require("../../models/cart_product");
const Token = require("../../models/token");

const getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (!userCount) {
            res.status(500).json({message: 'Could not count users.'});
        }
        return res.json({ userCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({message: 'User not fount!'});
        }
        
        const orders = await Order.find({ user: userId });
        const orderItemIds = orders.flatMap((order) => order.orderItems);

        await Order.deleteMany({ user: userId });
        await OrderItem.deleteMany({ _id: { $in: orderItemIds } });

        await CartProduct.deleteMany({ _id: { $in: user.cart } });

        await User.findByIdAndUpdate(userId, { $pull: {cart: {$exists: true}} });

        await Token.deleteOne({ userId: userId });

        await User.deleteOne({ _id: userId });

        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const addCategory = async (req, res) => {
    try {
        console.log(req);
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const editCategory = async (req, res) => {
    try {
        console.log(req);
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const deleteCategory = async (req, res) => {
    try {
        console.log(req);
    } catch (error) {
        console.error(error);
        return res.status(500).json({type: error.name, message: error.message});
    }
}

module.exports = {
    getUserCount,
    deleteUser,
    addCategory,
    editCategory,
    deleteCategory,
}