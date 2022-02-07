module.exports = {
    business: { /** Business logic & Functional specifiers */
        usersCapacity: 500,
        maxRequestsPerSecond: 4,
        acceptableDuration: 1000
    },
    roles: {
        User: 'user',
        Administrator: 'administrator',
    },
}