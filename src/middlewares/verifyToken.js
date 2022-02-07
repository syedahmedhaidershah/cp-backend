var jwt = require('jsonwebtoken');

const {
    JWT_EXPIRES_IN,
    JWT_SECRET
} = require('../config');

const response = require('../libraries/response');

const verifyToken = (req, res, next, options = {}) => {
    const {
        headers: {
            authorization: bearerToken,
        }
    } = req;

    /** As a service function option will allow using this middleware/controller
     * as a service as a function within our application
     */
    const {
        asAServiceFunction
    } = options;

    if (!req.headers.authorization) {
        const authError = new Error('AuthRequired');

        if (asAServiceFunction)
            throw authError;

        response(res, authError, 403)
    } else {
        try {
            var decoded = jwt.verify(
                bearerToken,
                JWT_SECRET
            );

            if (decoded) {
                if (!req.body)
                    req.body = {};

                const { emailAddress } = decoded;

                if (emailAddress)
                    req.body.emailAddress = emailAddress;

                Object.assign(
                    req.headers,
                    {
                        decoded
                    }
                );

                if (asAServiceFunction)
                    return decoded;

                next();
            } else {
                const invalidTokenError = new Error('InvalidToken');

                if (asAServiceFunction)
                    throw invalidTokenError;

                response(res, invalidTokenError, 403);
            }
        } catch (err) {
            const trialExpiredError = new Error('TrialExpired');

            if (asAServiceFunction)
                throw trialExpiredError;

            response(res, trialExpiredError, 403)
        }
    }

};

module.exports = {
    verifyToken
}