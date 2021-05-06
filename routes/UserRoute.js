const Express = require('express')
const UserController = require('../controller/UserController')
const AuthController = require('../controller/AuthController')
const userAuth = require('../helper/UserLoggedIn')
const router = Express.Router();

router.get('/register/', AuthController.register);
router.post('/register/', AuthController.registration);


router.get('/login/', userAuth.notIsLoggedIn  ,AuthController.login);
router.post('/login/', userAuth.notIsLoggedIn,  AuthController.userLogin);
router.post('/logout/', userAuth.isLoggedIn, AuthController.logout);

router.get('/addcart/:productId', UserController.addToCart);
router.get('/removecart/:cartId', UserController.removeFromCart);

router.use('/checkout/', UserController.checkout);
router.get('/order/success', UserController.success);
// router.get('/order/failed', UserController.failed);
router.get('/orders/' , UserController.orderList);

module.exports = router;