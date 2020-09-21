const router = require('express').Router();

const accs = require('../controllers/accounts');
const products = require('../controllers/products');
const orders = require('../controllers/orders');

const validation = require('../middlewares/validation');

router.get('/', (req, res) => {
    res.render('admin/index');
}); //OK

//OK
router.get('/users', accs.listing);

//OK
router.get('/userRead', accs.reading);

//OK
router.post('/users/delete', accs.delete);

//OK
router.get('/users/find', accs.finding);

//OK
router.get('/products', products.listing);

//OK
router.get('/products/find', products.finding);

//OK
router.get('/products/add', (req, res) => {
    res.render('admin/productAdd');
});

//OK
router.post('/products/add', validation.product, products.adding);

//OK
router.post('/products/delete', products.deleting);

//OK
router.get('/products/edit', products.editor);

router.post('/products/edit', products.editing);

//OK
router.get('/orders', orders.listing);

//OK
router.get('/orderRead', orders.reading);

module.exports = router;