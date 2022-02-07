/** Third party dependencies */
const joi = require('joi');


/** Local Statics & Imports */
const {
    AppData: { roles }
} = require('../imports');


const signupPayload = async (data) => {
    const signupValidator = joi.object({
        emailAddress: joi.string()
            .email({
                minDomainSegments: 2, tlds: {
                    allow: [
                        'com',
                        'net',
                    ]
                }
            })
            .required(),
        password: joi
            .string()
            .required(),
        username: joi
            .string()
            .required(),
        role: joi.string()
            .valid(
                ...Object.values(roles),
            )
            .required(),
        firstName: joi
            .string()
            .required(),
        lastName: joi
            .string()
            .required(),
    }, 'InvalidRequestBody');

    const { error, ...rest } = await signupValidator.validate(data);

    if (error)
        throw new Error(error.name);

    return rest;
}

const warehouseManagerCreatePayload = async (data) => {
    const signupValidator = joi.object({
        email: joi.string()
            .email({
                minDomainSegments: 2, tlds: {
                    allow: [
                        'com',
                        'net',
                    ]
                }
            })
            .required(),
        password: joi
            .string()
            .required(),
        firstName: joi
            .string()
            .required(),
        lastName: joi
            .string()
            .required(),
    }, 'InvalidRequestBody');

    const { error, ...rest } = await signupValidator.validate(data);

    if (error)
        throw new Error(error.name);

    return rest;
}

const loginPayload = async (data) => {
    const loginValidator = joi.object({
        emailAddress: joi.string()
            .email({
                minDomainSegments: 2, tlds: {
                    allow: [
                        'com',
                        'net',
                    ]
                }
            })
            .required(),
        username: joi.string(),
        password: joi.string()
            .required(),
        role: joi.string()
            .required(),
    });

    const { error, ...rest } = await loginValidator.validate(data);

    if (error)
        throw new Error(error.name);

    return rest;
}

const forgetPassPayload = async (data) => {
    const forgetPassValidator = joi.object({
        emailAddress: joi.string()
            .email({
                minDomainSegments: 2, tlds: {
                    allow: [
                        'com',
                        'net',
                    ]
                }
            })
            .required(),
    });

    const { error, ...rest } = await forgetPassValidator.validate(data);

    if (error)
        throw new Error(error.name);

    return rest;
}

const warehouseCreatePayload = async (data) => {
    const signupValidator = joi.object({
        name: joi.string().required(),
        phone: joi.string().required(),
        email: joi.string()
            .email({
                minDomainSegments: 2, tlds: {
                    allow: [
                        'com',
                        'net',
                    ]
                }
            })
            .required(),
        totalEmployees: joi.number().required(),
        description: joi.string().required(),
        manager: joi.string().hex().min(24).max(24).required()
    }, 'InvalidRequestBody');

    const { error, ...rest } = await signupValidator.validate(data);

    if (error)
        throw new Error(error.name);

    return rest;
}

const portCreatePayload = async (data) => {
    const signupValidator = joi.object({
        name: joi.string().required(),
        phone: joi.string().required(),
        email: joi.string()
            .email({
                minDomainSegments: 2, tlds: {
                    allow: [
                        'com',
                        'net',
                    ]
                }
            })
            .required(),
        totalEmployees: joi.number().required(),
        description: joi.string().required(),
        manager: joi.string().hex().min(24).max(24).required(),
        warehouses: joi.array().items(joi.string().hex().min(24).max(24)).required()
    }, 'InvalidRequestBody');

    const { error, ...rest } = await signupValidator.validate(data);

    if (error)
        throw new Error(error.name);

    return rest;
}


module.exports = {
    signupPayload,
    loginPayload,
    forgetPassPayload,
    warehouseManagerCreatePayload,
    warehouseCreatePayload,
    portCreatePayload
};