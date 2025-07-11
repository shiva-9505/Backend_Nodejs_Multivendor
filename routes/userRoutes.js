const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/userregister', userController.userRegister);
router.post('/userlogin', userController.userLogin);
router.post('/verify-otp', userController.verifyOtpAndLogin);

module.exports = router;