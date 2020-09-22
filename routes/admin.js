const router = require('express').Router();

const accs = require('../controllers/accounts');
const products = require('../controllers/products');
const orders = require('../controllers/orders');

const validation = require('../middlewares/validation');

/**
 * Chuyển sang trang chủ cho admin.
 */
router.get('/', (req, res) => {
    res.render('admin/index');
});

/**
 * Xem danh sách tài khoản người dùng trong hệ thống.
 */
router.get('/users', accs.listing);

/**
 * Xem chi tiết tài khoản người dùng.
 */
router.get('/userRead', accs.reading);

/**
 * Xóa tài khoản người dùng khỏi hệ thống.
 */
router.post('/users/delete', accs.delete);

/**
 * Tìm kiếm tài khoản người dùng.
 */
router.get('/users/find', accs.finding);

/**
 * Xem danh sách sản phẩm trong hệ thống.
 */
router.get('/products', products.listing);

/**
 * Tìm kiếm sản phẩm trong hệ thống.
 */
router.get('/products/find', products.finding);

/**
 * Chuyển sang trang thêm sản phẩm.
 */
router.get('/products/add', (req, res) => {
    res.render('admin/productAdd');
});

/**
 * Thêm sản phẩm vào hệ thống.
 */
router.post('/products/add', validation.product, products.adding);

/**
 * Xóa sản phẩm ra khỏi hệ thống.
 */
router.post('/products/delete', products.deleting);

/**
 * Chuyển sang trang chỉnh sửa sản phẩm.
 */
router.get('/products/edit', products.editor);

/**
 * Chỉnh sửa sản phẩm.
 */
router.post('/products/edit', products.editing);

/**
 * Xem danh sách đơn hàng.
 */
router.get('/orders', orders.listing);

/**
 * Xem chi tiết đơn hàng.
 */
router.get('/orderRead', orders.reading);

/**
 * Tìm kiếm đơn hàng.
 */
router.get('/orders/find', orders.finding);

/**
 * Xóa đơn hàng.
 */
router.post('/orders/delete', orders.delete);

/**
 * Chuyển trạng thái đơn hàng sang bước tiếp theo.
 */
router.post('/orders/nextStep', orders.status);

module.exports = router;