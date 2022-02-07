const subscription = require('./subscription.model');
const user = require('./user.model');
const chat = require('./chat.model');

module.exports = {
    ...subscription,
    ...user,
}