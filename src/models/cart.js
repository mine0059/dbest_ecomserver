const { Schema, model } = require('mongoose');

const cartSchema = Schema(
    {
        orderItems: [{type: Schema.Types.ObjectId, ref: 'CartProduct', required: true}],
    }
);

cartSchema.set('toObject', {virtuals: true});
cartSchema.set('toJSON', {virtuals: true});

exports.Cart = model('Cart', cartSchema);