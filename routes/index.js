/**
 * Modules.
 */
const express = require('express');
const router = express.Router();

/**
 * Middlewares.
 */
const validation = require('../middlewares/validation');

/**
 * Controllers.
 */
const products = require('../controllers/products');
const accs = require('../controllers/accounts');
const cart = require('../controllers/cart');

 /**
  * Chuyển sang trang chủ.
  */
router.get('/', (req, res) => {
    if(req.user.auth === "admin"){
        res.redirect('/admin');
        return;
    } else {
        res.redirect('/index');
        return;
    }
});

/**
 * Chuyển sang trang chủ cho người dùng.
 */
router.get('/index', products.listing);

/**
 * Chuyển sang trang đăng ký tài khoản.
 */
router.get('/register', (req, res) => {
    res.render('register');
});

/**
 * Đăng ký tài khoản mới.
 */
router.post('/register', validation.register, accs.register);

/**
 * Chuyển sang trang đăng nhập.
 */
router.get('/login', (req, res) => {
    if(req.session.token){
        res.json({
            message: `You are logged in`
        });
        return;
    } else {
        res.render('login')
    }
});

/**
 * Đăng nhập vào hệ thống.
 */
router.post('/login', validation.login, accs.login);

/**
 * Đăng xuất khỏi hệ thống.
 */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

/**
 * Tìm kiếm sản phẩm.
 */
router.get('/find', products.finding);

/**
 * Thêm sản phẩm vào giỏ hàng.
 */
router.post('/addToCart', cart.add);

/**
 * Xóa sản phẩm ra khỏi giỏ hàng.
 */
router.post('/removeFromCart', cart.remove);

/**
 * Chỉnh sửa giỏ hàng.
 */
router.post('/editCart', cart.edit)

module.exports = router;