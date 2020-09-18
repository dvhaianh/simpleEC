const router = require('express').Router();

const accs = require('../controllers/accounts');
const orders = require('../controllers/orders');

//OK
router.post('/buy', orders.adding);

//OK
router.get('/readOrder', orders.reading);

//OK
router.get('/myOrders', orders.myListing);

//OK
router.post('/cancel', orders.cancel);

router.get('/find', orders.findMine)

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