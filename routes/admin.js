const router = require('express').Router();

const accs = require('../controllers/accounts');
const products = require('../controllers/products');
const orders = require('../controllers/orders');

router.get('/', (req, res) => {
    res.render('admin/index');
}); //OK

router.get('/users', accs.listing);

router.get('/readUser', accs.reading);

router.get('/products', products.listing);

router.get('/orders', orders.listing);

router.get('/readOrder', orders.reading);

module.exports = router;