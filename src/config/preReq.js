/** Local dependencies / Libraries */
const {
    Common: {
        readLineAsync,
        getGen,
    },
} = require('../libraries');


/** Third party dependencies */
const Bluebird = require('bluebird'); // eslint-disable-line no-global-assign

const mongoose = require('mongoose');

const util = require('util');

const debug = require('debug')('node-server:index');


/** Local statics & imports */
const {
    SeedData,
} = require('../imports');


/**
 * Pre requisite functions and configuration for application / web-server
 * @property {*} app - Express App
 * @property {*} config - Configuration object for applications
 * @returns {Promise<void>}
 */
module.exports = async (app, config) => {
    try {
        /** Global available definition for root
     * Though a bad practice, but boiler plate strategy for testing.
     */
        global['root'] = __dirname

        /**
         * Replacing promise by Bluebird
         */
        Object.assign(
            Promise.prototype,
            Bluebird
        );


        const {
            NODE_ENV,
            PORT,
            JWT_SECRET,
            JWT_EXPIRES_IN,
            MONGO_HOST,
            MONGOOSE_DEBUG,
            SOCKET_IO_REDIS_PORT,
            REDIS_DB_NO,
            SEED,
        } = config;


        // plugin bluebird promise in mongoose
        mongoose.Promise = Promise;

        mongoose.connection
            .on('error', () => {
                throw new Error(`unable to connect to database: ${MONGO_HOST}`);
            });

        console.log('connecting to database...');

        await mongoose.connect(
            MONGO_HOST,
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                promiseLibrary: Promise,
            }
        );

        /** Testing to see if to seed data or not */
        if (JSON.parse(SEED)) {
            const toSeed = await readLineAsync('Seed data before launching (y/n)? ');

            if (toSeed === 'y') {
                /** Seeding package details */
                const {
                    packageDetails
                } = SeedData;

                if (packageDetails.length) {
                    for await (let index of getGen(packageDetails.length)) {
                        const package = packageDetails[index];
                        const saved = await package.save();
                        
                        console.log('package seeded: ');
                        console.log(saved);
                    }
                }
            }
        }

        // print mongoose logs in dev env
        if (MONGOOSE_DEBUG)
            await mongoose.set('debug', (collectionName, method, query, doc) => {
                debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
            });

    } catch (exc) {
        console.log(exc);
    }
}