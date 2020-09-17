const router = require('express').Router();
const ctrl = require('../controllers/products');
const cart = require('../controllers/cart');

const validation = require('../middlewares/validation');
const authentication = require('../middlewares/authentication');

//List
router.get('/', ctrl.listing);

//Find
router.get('/find', ctrl.finding);

//Cart
router.post('/addToCart', authentication, cart.addToCart);

// //Add
// router.post('/add', validation.product, authentication, ctrl.adding);


// //Edit
// router.post('/edit/:productID', ctrl.editing);

// //Delete
// router.delete('/:productID', ctrl.deleting);

module.exports = router;