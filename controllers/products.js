const products = require('../models/products');

module.exports.listing = async (req, res) => {
    if(!req.session.cart){
        req.session.cart = [];
    }
    try {
        const Products = await products.listing();
        if(req.user.auth === "admin"){
            res.render('admin/products', {
                header: "All products",
                Products,
                data: Products
            });
            return;
        }
        res.render('user/index', {
            Products,
            data: Products,
            cart: req.session.cart,
            user: req.user
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
    const {infor} = req.query;
    if(infor == ""){
        if(req.user.auth !== "admin"){
            res.redirect('/');
            return;
        } else {
            res.redirect('/admin/products');
            return;
        }
    }
    try {
        const Products = await products.listing();
        const product = await products.finding(infor);
        if(!product){
            res.json({
                message: `Product is not found`
            });
            return;
        } else {
            if(req.user.auth !== "admin"){
                res.render('user/index', {
                    Products,
                    data: product,
                    cart: req.session.cart? req.session.cart: [],
                    user: req.user
                });
                return;
            } else {
                res.render('admin/products', {
                    header: "Find product",
                    Products,
                    data: product
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
};  //OK

module.exports.adding = async (req, res) => {
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
            const product = await products.finding(infor.productID);
            res.redirect('/admin/products/find?infor=' + productID);
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
};  //

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
            const product = await products.finding(productID);
            res.json({
                message: `Update product ${productID} successfully`,
                data: product
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
};  //

module.exports.deleting = async (req, res) => {
    const {productID} = req.body;
    try {
        if(await products.finding(productID)){
            await products.delete(productID);
            res.redirect('/admin/products');
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