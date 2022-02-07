/** Third party dependencies*/
const { Router } = require('express');


/** Local dependencies and functions */
const {
    signup,
    login,
    forgotPassword,
    verifyOTPForForgottenPass,
    resetPassword
} = require('./users.controller');

const {
    verifyToken,
    schemaValidator,
} = require('../../middlewares');


const router = Router();


router
    .post(
        '/signup',
        schemaValidator('signupPayload'),
        signup,
    );

router
    .post(
        '/login',
        schemaValidator('loginPayload'),
        login,
    );

router
    .post(
        '/forgetPassowrd',
        schemaValidator('forgetPassPayload'),
        forgotPassword,
    );

router
    .post(
        '/forgetPassOTP',
        // schemaValidator('forgetPassPayload'),
        verifyOTPForForgottenPass,
    );  
    
router
    .post(
        '/resetPass',
        // schemaValidator('forgetPassPayload'),
        resetPassword,
    );      

module.exports = router;
