const AggregationFactories = require('./aggregation.factory');
const MongooseValidatorFactories = require('./aggregation.factory');
const EmailFactories = require('./emails.factory');
const QueueFactory = require('./queue.factory');
const ErrorsFactory = require('./errors.factory');

module.exports = {
    AggregationFactories,
    MongooseValidatorFactories,
    QueueFactory,
    EmailFactories,
    ErrorsFactory,
}