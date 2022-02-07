const transport = require("../libraries/mailer")
const { EmailFactories: { ForgotPassword } } = require("../factories")

const {DEV_EMAIL} = require('../config');

const forgotPassword = async (job) => {
    try {
        //Extract data from job
        const { emailAddress , otp:OTP } = job.data;


        const forgotPassword = new ForgotPassword(DEV_EMAIL,emailAddress);
        forgotPassword.concatHTML(`<br><br><h1><b>${OTP}</h1>`);

        const transported =  await transport.sendMail(forgotPassword.message);

        if(transported instanceof Error){
            return Promise.reject(false);
        }
        return transported ? true : false;
    } catch (exc) {
        return Promise.reject(exc)
    }
}

module.exports = forgotPassword;