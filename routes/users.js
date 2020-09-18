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

//OK
router.get('/find', orders.findMine)

//OK
router.get('/information', accs.reading);

router.post('/changeInformation', accs.changeInfor);

router.get('/changePassord', (req, res) => {
    res.render('/user/changePass');
});

router.post('/changePassword', accs.changePwd);

module.exports = router;