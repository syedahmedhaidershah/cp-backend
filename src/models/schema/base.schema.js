const { Schema } = require('mongoose');

const BaseSchema = new Schema({
    isInActive: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

module.exports = {
    BaseSchema,
}
