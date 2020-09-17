const router = require('express').Router();
const ctrl = require('../controllers/orders');

const validation = require('../middlewares/validation');

// //List
// router.get('/', ctrl.listing);

router.get('/myOrders', ctrl.myListing);

// //Find
// router.get('/find', ctrl.finding);

router.get('/readOrder', ctrl.reading)

// //Add
router.post('/buy', validation.order, ctrl.adding);

// //Edit
// router.post('/cancel/:orderID', ctrl.cancel);

// router.post('/status/:orderID', ctrl.status);

// //Delete
// router.delete('/:orderID', ctrl.delete);

module.exports = router;