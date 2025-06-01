const { Order } = require('../../models/order');
const { OrderItem } = require('../../models/order_items');

const getOrders = async function (req, res) {
    try {
        const orders = await Order.find()
        .select('-statusHistory')
        .populate('user', 'name email')
        .sort({dataOrdered: -1})
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name',
                populate: {
                    path: 'category', select: 'name',
                }
            }
        })
    if (!orders) {
        return  res.status(404).json({message: 'No orders found'});
    }

     return res.status(200).json({orders});
        
    } catch (error) {
        return res.status(500).json({type: error.name, message: error.message});
 }
}

const getOrdersCount = async function (req, res) {
    try {
        const ordersCount = await Order.countDocuments();
        if (ordersCount === 0) {
            return res.status(500).json({message: 'Could not count orders.'});
        }

        return res.status(200).json({count: ordersCount});
    
 } catch (error) {
        return res.status(500).json({type: error.name, message: error.message});
 }
}

/**
 * NB: This function is used to change the status of an order.
 * this is suposed to go through a process of maybe shipment, .. before getting to deliverd 
 * so we do not let them go directly from pending to shipped/deliverd 
 * we would implement those later but now lets do an easy one first we would work on that later in the course.
 * for now let work on a simpler form.
 */
const changeOrderStatus = async function (req, res) {
    try {
        const orderId = req.body;
        const newStatus = req.body.status;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(400).json({message: 'Order not found'});
        }

        if (!order.statusHistory.includes(newStatus)) {
            order.statusHistory.push(newStatus);
        }

        order.status = newStatus;
        order = await order.save();
        return res.status(200).json({order});
    } catch (error) {
        return res.status(500).json({type: error.name, message: error.message});
    }
}

const deleteOrders = async function (req, res) {
    try {
        const orderId = req.params.id;
        const order = await Order.findByIdAndDelete(orderId);
         if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }
        for (const orderItemId of order.orderItems) {
            await OrderItem.findByIdAndDelete(orderItemId);
        }
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({type: error.name, message: error.message});
    }
}

module.exports = {
    getOrders,
    getOrdersCount,
    changeOrderStatus,
    deleteOrders,
};