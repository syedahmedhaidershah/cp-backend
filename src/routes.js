const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

const users = require('./modules/users/users.routes');

/** GET /health-check - zzzCheck service health */
router
    .get(
        '/health-check',
        (req, res, next) => res.send('OK')
    );

router
    .use('/users', users);

router
    .all('*',
        (req, res, next) => res
            .status(404)
            .send('notfound')
    );

module.exports = router;
