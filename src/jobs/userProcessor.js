const User = require('../modules/users/users.repository');

const saveDataPorcessor = async (receivedData) => {
    try {
        const { data } = receivedData
        await User.insert(data);
        return true;
    } catch (exc) {
        throw exc;
    }
}

module.exports = saveDataPorcessor;