const router = require('express').Router();
const ctrl = require('../controllers/users');

const authentication = require('../middlewares/authentication');
const validation = require('../middlewares/validation');

//Login
router.post('/login', validation.login, ctrl.login);

//List
router.get('/', authentication, ctrl.listing);

//Find
router.get('/find', authentication, ctrl.finding);

//Add
router.post('/register', validation.register, ctrl.register);

//Edit  
router.post('/ChangeInformation/:username', authentication, ctrl.changeInfor);

router.post('/ChangePassword/:username', authentication, ctrl.changePwd);

//Delete
router.delete('/:username', authentication, ctrl.delete);

module.exports = router;