const router = require('express').Router();
const ctrl = require('../controllers/orders');

const validation = require('../middlewares/validation');

//List
router.get('/', ctrl.listing);

router.get('/myOrders', ctrl.myListing);

//Find
router.get('/find', ctrl.finding);

router.get('/findMine', ctrl.findMine);

//Add
router.post('/buy', validation.order, ctrl.adding);

//Edit
router.post('/edit/:orderID', ctrl.editing);

router.post('/cancel/:orderID', ctrl.cancel);

router.post('/status/:orderID', ctrl.status);

//Delete
router.delete('/:orderID', ctrl.delete);

module.exports = router;