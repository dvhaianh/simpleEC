/**
 * Modules.
 */
const mongoose = require('mongoose');

/**
 * Schema:
 *      orderID:        Mã đơn hàng.
 *      username:       Người mua hàng.
 *      orderdetail:    Danh sách sản phẩm mua.
 *      money:          Tổng tiền của đơn hàng.
 *      status:         Trạng thái đơn hàng.
 */
const ORDER = new mongoose.Schema({
    orderID: {
        type: String,
        requried: true,
        index: true
    },
    username: {
        type: String,
        rqeuired: true,
        index: true
    },
    orderdetail: Array(),
    money: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "making",
        index: true
    }
});

/**
 * Models.
 */
const orders = mongoose.model('orders', ORDER, 'orders');

/**
 * Liệt kê tất cả đơn hàng.
 */
module.exports.listing = () => {
    return orders.find()
        .sort("orderID")
        .then(doc => {
            return doc;
        });
};

/**
 * Tìm kiếm đơn hàng.
 * @param {String} input Thông tin đơn hàng (mã đơn, người đặt, trạng thái).
 */
module.exports.finding = input => {
    return orders
        .find({
            $or: [
                { orderID: input },
                { username: input },
                { status: input }
            ]
        })
        .then(doc => {
            if (doc.length > 0) return doc;
        });
};

/**
 * Xem chi tiết đơn hàng.
 * @param {String} orderID Mã đơn hàng.
 */
module.exports.reading = orderID => {
    return orders.findOne({ orderID })
        .then(doc => {
            if (doc) return doc;
        });
};

/**
 * Tìm kiếm đơn hàng của người dùng.
 * @param {String} username Tài khoản người dùng.
 * @param {String} input Thông tin đơn hàng (mã đơn, trạng thái).
 */
module.exports.findMine = (username, input) => {
    return orders
        .find({
            $and: [
                { username },
                {
                    $or: [
                        { orderID: input },
                        { status: input }
                    ]
                }
            ]
        })
        .sort("orderID")
        .then(doc => {
            return doc;
        });
};

/**
 * Thêm đơn hàng - Mua hàng.
 * @param {String} username Tài khoản người mua.
 * @param {Object} input Chi tiết đơn hàng.
 */
module.exports.ordering = (username, input) => {
    const newOrder = new orders({
        orderID: input.orderID,
        username,
        orderdetail: input.orderdetail,
        money: input.money
    });
    newOrder.save();
};

/**
 * Chỉnh sửa đơn hàng.
 * @param {String} orderID Mã đơn hàng.
 * @param {Object} input Thông tin thay đổi.
 */
module.exports.editing = (orderID, input) => {
    orders.findOneAndUpdate(
        { orderID },
        {
            orderdetail: input.orderdetail,
            money: input.money
        })
        .exec();
};

/**
 * Thay đổi trạng thái đơn hàng.
 * @param {String} orderID Mã đơn hàng.
 * @param {String} status Trạng thái mới.
 */
module.exports.status = (orderID, status) => {
    orders.findOneAndUpdate(
        { orderID },
        { status })
        .exec();
};

/**
 * Xóa đơn hàng.
 * @param {String} orderID Mã đơn hàng.
 */
module.exports.delete = orderID => {
    orders.findOneAndDelete({orderID}).exec();
};

/**
 * Xóa các đơn hàng của tài khoản bị xóa khỏi hệ thống.
 * @param {String} username Tài khoản bị xóa.
 */
module.exports.deleteUser = username => {
    orders.deleteMany({username}).exec();
};