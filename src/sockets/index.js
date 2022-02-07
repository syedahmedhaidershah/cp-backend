/** Core dependencies */
const http = require('http');


/** Third party dependencies & libraries */
const socketIO = require('socket.io');

const redis = require('redis').createClient;

const socketIoRedis = require('socket.io-redis');



/** Local Statics & Imports */
const {
  SOCKET_IO_REDIS_PORT: socketIoRedisPort,
  REDIS_DB_NO: db,
  REDIS_HOST: host,
} = require('../config');

/**
 * @param {*} server - HTTP Server extended with Express Instance
 * @returns {*} server
 */
const socketIntializationWithExpress = function (server) {
  global['io'] = socketIO(
    server,
    {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    }
  );

  const pubClient = redis(socketIoRedisPort, host, { db });
  const subClient = redis(socketIoRedisPort, host, { db });

  const redisAdapterForIo = socketIoRedis(
    {
      pubClient,
      subClient
    }
  );

  io.adapter(redisAdapterForIo);

  /** Setting up Broadcast messages socket
   * Import socket modules here
   */
  const chat = require('./modules/chat');

  /** Assigning socket modules to global io variable */
  Object.assign(
    io,
    {
        chat
    }
  )

  // start listening from sticky, it'll auto spawn workers based on cpu cores
  // https://stackoverflow.com/questions/51301126/nodejs-clustering-with-sticky-session
  return server;
}

module.exports = {
  socketIntializationWithExpress,
};