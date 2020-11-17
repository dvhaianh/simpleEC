const products = require('../models/products');

/**
 * Danh sách sản phẩm có trong hệ thống.
 */
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
};

/**
 * Tìm kiếm sản phẩm.
 */
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
};

/**
 * Thêm sản phẩm.
 */
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
            const url = '/admin/products/find?infor=' + productID;
            res.redirect(url);
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
 * Chuyển hướng sang trang sửa sản phẩm.
 */
module.exports.editor = async (req, res) => {
    const {productID} = req.query;
    try {
        const product = await products.finding(productID);
        if(product){
            res.render('admin/productEdit', {
                data: product[0]
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
 * Chỉnh sửa sản phẩm.
 */
module.exports.editing = async (req, res) => {
    const productID = req.body.productID;
    const infor = {
        productName: req.body.productName,
        price: req.body.price,
        image: req.body.image
    }
    console.log(productID);
    try {
        if(await products.finding(productID)){
            await products.editing(productID, infor);
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
};

/**
 * Xóa sản phẩm.
 */
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
};