const mongoose = require('mongoose');

/** Local dependencies and functions */
const { TRIAL_PERIOD } = require('../config');
const { extendSchema } = require('../utils');
const { Statics: { accounts } } = require('../imports');
const { BaseSchema } = require('./schema/base.schema');

/**
 * Subscription Schema
 */
const SubscriptionSchema = extendSchema(new mongoose.Schema({
    planType: {
        type: String,
        enum: Object.values(accounts.plans),
        required: true,
    },
    validityDays: { type: Number, default: TRIAL_PERIOD },
    startDate: { type: Date, required: true, default: () => new Date() },
    endDate: { type: Date, required: true, default: () => new Date(+new Date() + TRIAL_PERIOD * 86400000) },
    isActive: { type: Boolean, required: true, default: true },
}), BaseSchema);

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

/**
 * @typedef {[Subscription, SubscriptionSchema]}
 */
module.exports = {
    Subscription,
    SubscriptionSchema,
};