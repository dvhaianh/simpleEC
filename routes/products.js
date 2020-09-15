const router = require('express').Router();
const ctrl = require('../controllers/products');

const authentication = require('../middlewares/authentication');
const validation = require('../middlewares/validation');

//List
router.get('/', ctrl.listing);

//Find
router.get('/find', ctrl.finding);

//Add
router.post('/add', validation.product, authentication, ctrl.adding);

//router.post('/addToCart', authentication, ctr.addToCart);

//Edit
router.post('/edit/:productID', authentication, ctrl.editing);

//Delete
router.delete('/:productID', authentication, ctrl.deleting);

module.exports = router;