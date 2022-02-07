const { ErrorsFactory } = require('../factories');

const response = require('../libraries/response');

const validators = require('../validators');


const schemaValidatorPicker = async (validatorName, req, res, next) => {
    try {
        const validatorToUse = validators[validatorName];

        const isValid = await validatorToUse(req.body);

        Object.assign(
            req.headers,
            { isValidRequestFor: validatorName }
        )

        next();
    } catch (err) {
        const useError = err.name || 'error-occured';
        
        const { Error: { error, status } } = new ErrorsFactory({ message: useError });

        response(res, error, status);
    }

}

const schemaValidator = (validatorName) => schemaValidatorPicker.bind(null, validatorName);

module.exports = {
    schemaValidator
}