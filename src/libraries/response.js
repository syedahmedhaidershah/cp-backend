const { ErrorsFactory } = require('../factories');

const { Errors: { types: errorTypes } } = require('../imports');

module.exports = function response(res, data, code) {
    try {
        const { name = '', message } = data || {};

        if (errorTypes.includes(name)) {
            if (code) {
                res.status(code);
                return res.json(message);
            }

            res.status(200);

            return res.json(message);
        }

        res.json(data);
    } catch (exc) {
        const { Error: { error, status } } = new ErrorsFactory({ message: 'Error' });

        res.status(status);

        res.send(error);
    }
}