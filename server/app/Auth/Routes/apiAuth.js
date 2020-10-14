const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')

require('../Controllers/AuthController')

router.post('/auth/register',  inputValidate, register)
router.post('/auth/login', inputloginValidate, login)
router.post('/auth/verify', inputverifyValidate, verifyLogin)
router.post('/auth/resend_otp', inputloginValidate, resendOTP)

module.exports = router;
