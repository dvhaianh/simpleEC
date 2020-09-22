/**
 * Modules.
 */
const orders = require('../models/orders');
const products = require('../models/products');

/**
 * Tính tổng tiền của đơn hàng.
 * @param {array} orderdetail Chi tiết đơn hàng.
 */
async function moneyCaculate(orderdetail) {
    let res = 0;
    for (let index in orderdetail) {
        const quantity = orderdetail[index].quantity;
        const price = await products.getPrice(orderdetail[index].productID);
        res += price * quantity;
    }
    return res;
};

/**
 * Người dùng liệt kê danh sách đơn hàng của mình.
 */
module.exports.myListing = async (req, res) => {
    const username = req.user.user;
    if (!username) {
        res.redirect('/login');
        return;
    };
    try {
        const myList = await orders.finding(username);
        if (myList) {
            res.render('user/myOrders', {
                user: req.user,
                data: myList,
                myList
            });
            return;
        } else {
            res.json({
                message: `You do not have any orders`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Xem thông tin đơn hàng.
 */
module.exports.reading = async (req, res) => {
    const username = req.user.user;
    if (!username) {
        res.redirect('/login');
        return;
    };
    const orderID = req.query.orderID;
    try {
        const order = await orders.reading(orderID);
        if (!order) {
            res.json({
                message: `Order not found`
            });
            return;
        } else {
            if (req.user.auth !== "admin") {
                res.render('user/readOrder', {
                    user: req.user,
                    data: order
                })
                return;
            } else {
                res.render('admin/readOrder', {
                    data: order
                });
                return;
            }
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Thêm đơn hàng mới - Mua hàng.
 */
module.exports.adding = async (req, res) => {
    const username = req.user.user;
    if (!username) {
        res.redirect('/login');
        return;
    };
    const orderdetail = JSON.parse(req.body.orderdetail),
        orderID = 'ord' + username + Date.now();
    try {
        if (await orders.finding(orderID)) {
            res.json({
                message: `OrderID is existed`
            });
            return;
        } else {
            const money = await moneyCaculate(orderdetail);
            const infor = {
                orderID,
                orderdetail,
                money
            };
            await orders.ordering(username, infor);
            req.session.cart = [];
            res.redirect('/users/readOrder?orderID=' + orderID);
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Hủy đơn.
 */
module.exports.cancel = async (req, res) => {
    const username = req.user.user;
    if (!username) {
        res.redirect('/login');
        return;
    };
    const { orderID } = req.body;
    try {
        const order = await orders.finding(orderID);
        if (order) {
            await orders.status(orderID, "cancel");
            res.redirect('/users/myOrders');
            return;
        } else {
            res.json({
                message: `Order is not found`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Người dùng tìm kiếm trong các đơn hàng của mình.
 */
module.exports.findMine = async (req, res) => {
    const username = req.user.user,
        { infor } = req.query;
    if(infor === ""){
        res.redirect('/users/myOrders');
    }
    try {
        const order = await orders.findMine(username, infor);
        const myList = await orders.finding(username);
        res.render('user/myOrders', {
            user: req.user,
            data: order,
            myList
        });
        return;
    } catch (error) {
        res.json({
            message: `${error}`
        });
        return;
    }
};

/**
 * Liệt kê tất cả đơn hàng.
 */
module.exports.listing = async (req, res) => {
    try {
        const orderList = await orders.listing();
        res.render('admin/orders', {
            header: "All orders",
            Orders: orderList,
            data: orderList
        });
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Tìm kiếm đơn hàng.
 */
module.exports.finding = async (req, res) => {
    const { infor } = req.query;
    if(infor === ""){
        res.redirect('/admin/orders');
    }
    try {
        const listFind = await orders.finding(infor);
        const Orders = await orders.listing();
        if (!listFind) {
            res.json({
                message: `Order is not found`
            });
            return;
        } else {
            res.render('admin/orders', {
                header: "Find order",
                Orders,
                data: listFind
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Thay đổi trạng thái đơn hàng.
 */
module.exports.status = async (req, res) => {
    const { orderID } = req.body;
    try {
        const order = await orders.finding(orderID);
        if (!order){
            res.json({
                message: `Order is not found`
            });
            return;
        } else {
            if(order[0].status === "making"){
                await orders.status(orderID, "shipping");
            } else {
                await orders.status(orderID, "complete");
            }
            res.redirect('/admin/orders');
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};

/**
 * Xóa đơn hàng.
 */
module.exports.delete = async (req, res) => {
    const { orderID } = req.body;
    try {
        if (await orders.finding(orderID)) {
            await orders.delete(orderID);
            res.redirect('/admin/orders');
            return;
        } else {
            res.json({
                message: `Order is not found`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};