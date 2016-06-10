'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('uselessApp.services', ['btford.socket-io'])
.factory('chatSocket', function (socketFactory) {
    var socket = socketFactory();
    socket.forward('broadcastBoard');
    socket.forward('broadcastThread');
    return socket;
}).
    value('version', '0.1');
