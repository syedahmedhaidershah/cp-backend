/** Local functions and dependencies */
const {
    createUser,
    loginUser,
    forgotPasswordUser,
    verifyOTPForForgottenPassUser,
    resetPasswordUser
} = require('./users.service');

const { ErrorsFactory } = require('../../factories');

const { Response: response } = require('../../libraries');

const signup = async (req, res, next) => {
    try {
        const signedUpUser = await createUser(req);

        response(res, signedUpUser);
    } catch (exc) {
        const { message } = exc;

        console.log(exc);

        const { Error: { error, status } } = new ErrorsFactory({ message });

        response(res, error, status);
    }
}

const login = async (req, res, next) => {
    try {
        const loggedInUser = await loginUser(req);
        console.log("res", loggedInUser);
        response(res, loggedInUser);
    } catch (exc) {
        const { message } = exc;

        console.log(exc);

        const { Error: { error, status } } = new ErrorsFactory({ message });

        response(res, error, status);
    }
}

/**
 * Request otp for password recovery
 * @property {*} req.body.emailAddress - Email Address to reset pasword for
 * @returns {*} response - Details of job intialization
 */
const forgotPassword = async (req, res, next) => {
    try {
        const {
            emailAddress,
            otp = await randomString.withAlphabets(6, true),
        } = req.body;

        let updated = await forgotPasswordUser(req);
        
        let forwarded = await UserAuthStrategy.requestPasswordRecovery({ emailAddress, otp });
        
        response(res, 'forwarded');
    } catch (exc) {
        const { message } = exc;

        console.log(exc);

        const { Error: { error, status } } = new ErrorsFactory({ message });

        response(res, error, status);
    }
}

/**
 * Verify otp and update password
 * @property {*} req.body.otp - OTP for resetting password
 * @returns {*} response - Details of job intialization
 */
const verifyOTPForForgottenPass = async (req, res, next) => {
    try {
        const { otp } = req.body;
        let newCode = await verifyOTPForForgottenPassUser(req)
        // let forwarded = await UserAuthStrategy.requestPasswordRecovery({ emailAddress, otp });
        response(res, { verificationCode: newCode });
    } catch (exc) {
        const { message } = exc;

        console.log(exc);

        const { Error: { error, status } } = new ErrorsFactory({ message });

        response(res, error, status);
    }
}

/**
 * Provide a new password with the verification code to have the password updated
 * @property {*} req.body.verificationCode - OTP for resetting password
 * @property {*} req.body.newPassword - new password to be set
 * @returns {*} response - Details of job intialization
 */
const resetPassword = async (req, res, next) => {
    try {
        const { otp, password } = req.body;
        let result = await resetPasswordUser(req)


        // let forwarded = await UserAuthStrategy.requestPasswordRecovery({ emailAddress, otp });
        if (result)
            response(res, 'updated');
    } catch (exc) {
        const { message } = exc;

        console.log(exc);

        const { Error: { error, status } } = new ErrorsFactory({ message });

        response(res, error, status);
    }
}


module.exports = {
    signup,
    login,
    forgotPassword,
    verifyOTPForForgottenPass,
    resetPassword,
};