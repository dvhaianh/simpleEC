const orders = require('../models/orders');

module.exports.listing = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    try {
        const orderList = await orders.listing();
        res.json({
            message: `Success`,
            amount: orderList.length,
            data: orderList
        });
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.myListing = async (req, res) => {
    const username = req.User.user;
    try {
        const myList = await orders.finding(username);
        if(myList){
            res.json({
                message: 'Success',
                amout: myList.length,
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
}   //OK

module.exports.findMine = async (req, res) => {
    const {infor} = req.body,
          username = req.User.user;
    try {
        const myOrder = await orders.findMine(username, infor);
        if(myOrder){
            res.json({
                message: 'success',
                amout: myOrder.length,
                data: myOrder
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
}   //OK

module.exports.adding = async (req, res) => {
    const username = req.User.user;
    const {orderID, orderdetail, money} = req.body;
    const infor = {
        orderID,
        orderdetail: JSON.parse(orderdetail),
         money
    }
    try {
        if(await orders.finding(orderID)){
            res.json({
                message: `OrderID is existed`
            });
            return;
        } else {
            await orders.ordering(username, infor);
            res.json({
                message: 'success',
                username,
                infor
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

module.exports.editing = async (req, res) => {
    const user = req.User.user;
    const {orderID} = req.params;
    try {
        const order = await orders.findMine(user, orderID);
        if(order){
            const infor = {
                orderdetail: JSON.parse(req.body.orderdetail),
                money: req.body.money
            };
            await orders.editing(orderID, infor);
            res.json({
                message: 'Success',
                data: infor
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
}   //OK

module.exports.cancel = async (req, res) => {
    const user = req.User.user;
    const {orderID} = req.params;
    try {
        const order = await orders.findMine(user, orderID);
        if(order){
            await orders.status(orderID, "cancel");
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
}   //OK

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
}   //OK

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
}   //OK