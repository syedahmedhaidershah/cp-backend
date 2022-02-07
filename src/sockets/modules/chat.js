/** Third party dependencies & Libraries */
const _ = require('lodash');


/** Local dependencies & Imports */
const {
    signAndReturnJWT
} = require('../../libraries');


/** Local statics & Imports */
const { roles } = require('../../imports');

const chatNamespace = io.of('/chat');


/** Chat namespace connection handler */
chatNamespace.on(
    'connection',
    (socket) => {
        try {
            console.log('Socket connected');

            socket.on('disconnect', (args) => {
                console.log('disconnected');
                console.log(args);
            })

            const {
                handshake: {
                    query: { token }
                }
            } = socket;

            const {
               chatId
            } = signAndReturnJWT(token);

            if (chatId)
                socket.join(`chatId-${chatId}`);

        } catch (exc) {
            socket.disconnect();

            console.log(exc);
        }
    }
);

/** Chat namespace sockets for specific query */
const socketsInChatForRoom = (query) => {

    const roomsToUse = Object.keys(query)
        .map(key => {
            const queryValue = query[key];

            /**
             * Example key-queryValue:
             * departmentId-HRAdmin
             */
            return chatNamespace
                .to(`${key}-${queryValue}`);
        })

    return roomsToUse;
};
// setInterval(() => {
    
//     chatNamespace.emit(
//         'test',
//          {
//             subject : "subject",
//             message : "message",
//             EmployeeId: 1,
//             SubDepartmentId: 1,
//             from: "Akram",
//           }
//     )
// },20000);

module.exports = {
    namespace: chatNamespace,
    socketsInRoom: socketsInChatForRoom
}