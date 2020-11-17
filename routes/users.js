const router = require('express').Router();

/**
 * Controllers.
 */
const accs = require('../controllers/accounts');
const orders = require('../controllers/orders');

/**
 * Mua các sản phẩm trong giỏ hàng.
 */
router.post('/buy', orders.adding);

/**
 * Xem chi tiết đơn đặt hàng.
 */
router.get('/readOrder', orders.reading);

/**
 * User xem danh sách các đơn đặt hàng của họ.
 */
router.get('/myOrders', orders.myListing);

/**
 * Hủy đơn hàng.
 */
router.post('/cancel', orders.cancel);

/**
 * Tìm kiếm đơn hàng.
 */
router.get('/find', orders.findMine)

/**
 * Xem thông tin cá nhân.
 */
router.get('/information', accs.reading);

/**
 * Thay đổi thông tin cá nhân.
 */
router.post('/changeInformation', accs.changeInfor);

/**
 * Chuyển sang trang đổi mật khẩu.
 */
router.get('/changePassword', (req, res) => {
    res.render('user/changePassword', {
        user: req.user
    });
});

/**
 * Đổi mật khẩu.
 */
router.post('/changePassword', accs.changePwd);

module.exports = router;