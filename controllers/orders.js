const orders = require('../models/orders');
const products = require('../models/products');

async function moneyCaculate(orderdetail) {
    let res = 0;
    for(let index in orderdetail) {
        const quantity = orderdetail[index].quantity;
        const price = await products.getPrice(orderdetail[index].productID);
        res += price * quantity;
    }
    return res;
}

//USER
module.exports.myListing = async (req, res) => {
    const username = req.user.user;
    if(!username){
        res.redirect('/login');
        return;
    };
    try {
        const myList = await orders.finding(username);
        if(myList){
            res.render('user/myOrders', {
                user: req.user,
                data: myList
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
}   //OK

module.exports.reading = async (req, res) => {
    const username = req.user.user;
    if(!username){
        res.redirect('/login');
        return;
    };
    const orderID = req.query.orderID;
    try {
        const order = await orders.reading(orderID);
        if(!order){
            res.json({
                message: `Order not found`
            });
            return;
        } else {
            if(req.user.auth !== "admin"){
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
}   //OK

module.exports.adding = async (req, res) => {
    const username = req.user.user;
    if(!username){
        res.redirect('/login');
        return;
    };
    const orderdetail = JSON.parse(req.body.orderdetail),
          orderID = 'ord' + username + Date.now();
    try {
        if(await orders.finding(orderID)){
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
            req.session.cart =[];
            res.redirect('/users/readOrder?orderID=' + orderID);
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.cancel = async (req, res) => {
    const username = req.user.user;
    if(!username){
        res.redirect('/login');
        return;
    };
    const {orderID} = req.body;
    try {
        const order = await orders.finding(orderID);
        if(order){
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
}   //OK


//ADMIN
module.exports.listing = async (req, res) => {try {
        const orderList = await orders.listing();
        res.render('admin/orders', {
            data: orderList
        });
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //

module.exports.finding = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {infor} = req.body;
    try {
        const listFind = await orders.finding(infor);
        if(listFind){
            res.json({
                message: 'success',
                amount: listFind.length,
                data: listFind
            });
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
}   //

module.exports.status = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const user = req.User.user;
    const {orderID} = req.params;
    try {
        const order = await orders.finding(orderID);
        if(order){
            const {status} = req.body
            await orders.status(orderID, status);
            res.json({
                message: `Success`
            });
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
}   //

module.exports.delete = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {orderID} = req.params;
    try {
        if(await orders.finding(orderID)){
            await orders.delete(orderID);
            res.json({
                message: 'Success'
            });
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
}   //