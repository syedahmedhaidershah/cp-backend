/** Third party dependencies*/
const mongoose = require('mongoose');
const _ = require('lodash');

/** Local libraries & dependencies */
const { extendSchema } = require('../utils');
const { SubscriptionSchema, Subscription } = require('./subscription.model');
const { BaseSchema } = require('./schema/base.schema');

/** Local static objects & dependencies */
const {
    Statics: { accounts },
    AppData: { roles }
} = require('../imports');


/** Un-discriminated (without base) */
const UserSchema = extendSchema(new mongoose.Schema({
    emailAddress: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: { type: Boolean, required: true, default: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String, required: false },
    contact: { type: Number , required : false},
    profession: { type: String, required: false },
    password: { required: false, type: String },
    role: {
        type: String,
        enum: Object.values(roles),
        required: true
    }
}), BaseSchema);


/**
 * User Methods
 */
UserSchema.methods = {
    safeModel: function (attributesToOmit = []) {
        return _.omit(
            this.toObject(),
            ['password', ...attributesToOmit]
        );
    },
    verifyAdministrator: function () {
        const isAdministrator = this.role === roles.Administrator;

        return Object.assign(
            this,
            isAdministrator
        )
    }
}

/** User Methods */
UserSchema.methods = {
    safeModel: function (data) {
        return _.omit(this.toObject(), ['password']);
    }
}


/**
 * User Statics
 */
UserSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */

    async getByEmail(emailAddress) {
        try {
            let user = await this.findOne({ emailAddress }).lean().exec()
            if (!user) {
                const e = new Error("No such user found")
                throw e
            }
            return (user.active) ? user : { active: false }
        } catch (error) {
            throw error
        }
    },

    async get(googleId) {
        try {
            let user = await this.findOne({ googleId }).lean().exec()
            if (!user) {
                const e = new Error("No such user found")
                throw e
            }
            return (user.active) ? user : { active: false }
        } catch (error) {
            throw error
        }
    },

    async updateData(user, data) {
        try {
            let updated = await user.update(data)
            if (!updated.nModified) {
                const error = new Error("user not updated")
                throw error
            }
            return updated
        } catch (error) {
            throw error
        }
    },

    async Create(userInst, reqHeaders) {
        try {
            const { isTrialAcc } = reqHeaders;
            userInst.subscription = new Subscription({
                planType: isTrialAcc ? accounts.plans.trial : accounts.plans.standard
            })

            const user = await this(userInst).save();
            return user
        } catch (error) {
            throw error
        }
    }
};


/** Indexes for Users */
UserSchema.index({
    emailAddress: -1
}, {
    name: "IDX_User-EmailAddress"
});

UserSchema.index({
    username: -1
}, {
    name: "IDX_User-UserName"
});

UserSchema.index({
    role: -1
}, {
    name: "IDX_User-Role"
});


/** Discriminating User Schema using Base model */
const User = mongoose.model('User', UserSchema);


/**
 * @typedef User
 */
module.exports = {
    User,
    UserSchema
};
