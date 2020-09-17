const router = require('express').Router();

const accs = require('../controllers/accounts');
const orders = require('../controllers/orders');

router.post('/buy', orders.adding);

router.get('/readOrder', orders.reading);

router.get('/myOrders', orders.myListing);

router.post('/cancel', orders.cancel);

router.get('/change', (req, res) => {
    res.render('user/change');
});

router.get('/changeInformation', (req, res) => {
    res.render('/user/changeInfor');
});

router.post('/changeInformation', accs.changeInfor);

router.get('/changePassord', (req, res) => {
    res.render('/user/changePass');
});

router.post('/changePassword', accs.changePwd);

module.exports = router;