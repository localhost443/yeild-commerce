const Express = require('express')
const UserController = require('../controller/UserController')
const router = Express.Router();

router.get('/register/', UserController.register);
router.post('/register/', UserController.registration);


router.get('/login/', UserController.login);
router.post('/login/', UserController.userLogin);
router.post('/logout/', UserController.logout);

router.get('/addcart/:productId', UserController.addToCart);
router.get('/removecart/:cartId', UserController.removeFromCart);

router.use('/checkout/', UserController.checkout);
router.get('/order/success', UserController.success);
// router.get('/order/failed', UserController.failed);
router.get('/orders/' , UserController.orderList);

module.exports = router;