const mongoose = require('mongoose');

const ORDER = new mongoose.Schema({
    orderID :{
        type: String,
        requried: true
    },
    username: {
        type: String,
        rqeuired: true
    },
    orderdetail: Array(),
    money: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "making"
    }
});

const orders = mongoose.model('orders', ORDER, 'orders');

//Listing
module.exports.listing = () => {
    return orders.find()
        .sort("orderID")
        .then(doc => {
            return doc;
        });
}

//Find
module.exports.finding = input => {
    return orders
        .find({$or:[
            {orderID: input},
            {username: input},
            {status: input}
        ]})
        .sort("orderID")
        .then(doc => {
            if(doc.length > 0) return doc;
        });
}

module.exports.reading = orderID => {
    return orders.findOne({orderID})
        .then(doc => {
            if(doc) return doc;
        });
}

//Add
module.exports.ordering = (username, input) => {
    const newOrder = new orders({
        orderID: input.orderID,
        username,
        orderdetail: input.orderdetail,
        money: input.money
    });
    newOrder.save();
}

//Edit
module.exports.editing = (orderID, input) => {
    orders.findOneAndUpdate(
        {orderID},
        {
            orderdetail: input.orderdetail,
            money: input.money
        })
        .exec();
}

module.exports.status = (orderID, status) => {
    orders.findOneAndUpdate(
        {orderID},
        {status})
        .exec();
}

//Delete
module.exports.delete = orderID => {
    orders.findOneAndDelete(orderID)
        .exec();
}