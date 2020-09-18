const router = require('express').Router();

const accs = require('../controllers/accounts');
const products = require('../controllers/products');
const orders = require('../controllers/orders');

router.get('/', (req, res) => {
    res.render('admin/index');
}); //OK

//OK
router.get('/users', accs.listing);

//OK
router.get('/readUser', accs.reading);

router.post('/users/delete', accs.delete);

//OK
router.get('/products', products.listing);

//OK
router.get('/orders', orders.listing);

//OK
router.get('/readOrder', orders.reading);

module.exports = router;