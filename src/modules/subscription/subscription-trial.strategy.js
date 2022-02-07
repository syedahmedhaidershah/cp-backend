const QueueFactory = require('../../factories/queue.factory');
const { trialExtensionRequest } = require('../../jobs');

const { bullConfig } = require('../../config');

class TrialAccountStrategy {
    static trialExtenstionQueue = null;

    static requestTrialExtension = (data) => {
        let { queueOptions, jobOptions, concurrency } = bullConfig;
        if (!this.trialExtenstionQueue) {
            this.trialExtenstionQueue = QueueFactory('trialExtenstionQueue', queueOptions, trialExtensionRequest, concurrency);
        }

        this.trialExtenstionQueue.add(data, jobOptions);
        return Promise.resolve({});
    }
}

module.exports = TrialAccountStrategy;