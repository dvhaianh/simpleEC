const express = require('express');
const router = express.Router();

const products = require('../controllers/products');
const accs = require('../controllers/accounts');
const cart = require('../controllers/cart');

const validation = require('../middlewares/validation');

 //Home             OK
router.get('/', (req, res) => {
    if(req.user.auth === "admin"){
        res.redirect('/admin');
        return;
    } else {
        res.redirect('/index');
        return;
    }
});

router.get('/index', products.listing);

//Register          OK
router.get('/register', (req, res) => {
    res.render('register');
}); //OK

router.post('/register', validation.register, accs.register);

//Login             OK
router.get('/login', (req, res) => {
    if(req.session.token){
        res.json({
            message: `You are logged in`
        });
        return;
    } else {
        res.render('login')
    }
}); //OK

router.post('/login', validation.login, accs.login);

//Logout            OK
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
}); //OK

//Find product      OK
router.get('/find', products.finding);

//Add to cart       OK
router.post('/addToCart', cart.add);

//Remove from cart  OK
router.post('/removeFromCart', cart.remove);

module.exports = router;