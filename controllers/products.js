const products = require('../models/products');

module.exports.listing = async (req, res) => {
    try {
        const Products = await products.listing();
        res.json({
            message: `All accounts here`,
            amount: Products.length,
            data: Products
        });
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};  //OK

module.exports.finding = async (req, res) => {
    const {infor} = req.body;
    try {
        const product = await products.finding(infor);
        if(!product){
            res.json({
                message: `Product is not found`
            });
            return;
        } else {
            res.json({
                message: `Success`,
                amount: product.length,
                data: product
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};  //OK

module.exports.adding = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {productID, productName, price, image} = req.body;
    const infor = {
        productID,
        productName,
        price,
        image
    };
    try {
        if(await products.finding(productID)){
            res.json({
                message: `ProductID is existed`
            });
            return;
        } else {
            await products.adding(infor);
            res.json({
                message: `A new product is added`,
                data: infor
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};  //OK

module.exports.editing = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {productID} = req.params;
    const infor = {
        productName: req.body.productName,
        price: req.body.price,
        image: req.body.image
    }
    try {
        if(await products.finding(productID)){
            await products.editing(productID, infor);
            res.json({
                message: `Update product ${productID} successfully`,
                data: infor
            });
            return;
        } else {
            res.json({
                message: `Product is not found`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};  //OK

module.exports.deleting = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {productID} = req.params;
    try {
        if(await products.finding(productID)){
            await products.delete(productID);
            res.json({
                message: `Delete product sucessfully`
            });
            return;
        } else {
            res.json({
                message: `Product is not found`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};  //OK