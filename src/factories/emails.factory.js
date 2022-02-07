const { Content: { emails: { trialExtension, forgotPassword, sendOtp } } } = require('../constants');

/**
 * Returns a general factory class to generate an email message object. Unlike trial this requires a  subject and message to initialize
 * @returns {GeneralMail} message - Message object
 */
class GeneralMail {

    _from;
    _to;
    _subject;
    _html;

    /**
     * Returns an object to factory class to generate an email message object for request of extension of trial period
     * @param { string } from - Sender's email address
     * @param { string } to - Receivers's email address
     * @returns {GeneralMail} message - Message object
     */
    constructor(from, to, subject, message) {
        this._from = from;
        this._to = to;
        this._subject = subject;
        this._html = message;
    }


    setSubject = (subject) => {
        this._subject = subject;
    }

    setHTML = (html) => {
        this._html = html;
    }

    concatHTML = (...paragraphs) => {
        paragraphs.forEach(p => {
            this._html += `<p>${p}</p>`;
        })
    }

    get message() {
        let {
            _from: from,
            _to: to, // List of recipients
            _subject: subject, // Subject line
            _html: html // Plain text body
        } = this;
        return {
            from,
            to, // List of recipients
            subject, // Subject line
            html // Plain text body
        }
    };
};

/**
 * Returns a factory class to generate an email message object for request of extension of trial period
 * @returns {TrialExtensionsMail} message - Message object
 */
class TrialExtensionsMail extends GeneralMail {
    /**
     * Returns an object to factory class to generate an email message object for request of extension of trial period
     * @param { string } from - Sender's email address
     * @param { string } to - Receivers's email address
     * @returns {TrialExtensionsMail} message - Message object
     */
    constructor(from, to) {
        super();
        this._from = from;
        this._to = to;
        this._subject = trialExtension.subject;
        this._html = trialExtension.html;
    }
};

/**
 * Returns a factory class to generate an email message object for a forgotten password
 * @returns {ForgotPassowrd} message - Message object
 */
class ForgotPassowrd extends GeneralMail {
    /**
     * Returns an object to factory class to generate an email message object for request of extension of trial period
     * @param { string } from - Sender's email address
     * @param { string } to - Receivers's email address
     * @returns {ForgotPassowrd} message - Message object
     */
    constructor(from, to) {
        super();
        this._from = from;
        this._to = to;
        this._subject = forgotPassword.subject;
        this._html = forgotPassword.html;
    }
};

/**
 * Returns a factory class to generate an email message object for sending out an OTP
 * @returns {SendOTP} message - Message object
 */
class SendOTP extends GeneralMail {
    /**
     * Returns an object to factory class to generate an email message object for request of extension of trial period
     * @param { string } from - Sender's email address
     * @param { string } to - Receivers's email address
     * @returns {SendOTP} message - Message object
     */
    constructor(from, to, data) {
        super();
        this._from = from;
        this._to = to;
        this._subject = sendOtp.subject;
        this._html = sendOtp.html;
    }
};

module.exports = {
    TrialExtensionsMail,
    GeneralMail,
    ForgotPassowrd,
    SendOTP
}