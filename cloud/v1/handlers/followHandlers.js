'use strict';
var followHandlers = exports;
var userService = require('./../services/userService.js');

var v1 = {};
v1.notification = require('./../notification');
v1.constants = require('./../constants');

followHandlers.afterDelete = function (request) {
    var friend = request.object;

    var toUser = friend.get("user");
    var fromUser = friend.get("sourceUser");

    userService.decrementUserCounter(fromUser, 'followingCount');
    userService.decrementUserCounter(toUser, 'followersCount');
};


followHandlers.afterSave = function (request) {
    var friend = request.object;

    var toUser = friend.get("user");
    var fromUser = friend.get("sourceUser");

    userService.incrementUserCounter(fromUser, 'followingCount');
    userService.incrementUserCounter(toUser, 'followersCount');

    try {
        var notificationObject = v1.notification.create({
            type: v1.constants.FOLLOW_NOTIFICATION,
            fromUser: fromUser,
            toUser: toUser
        });
    }
    catch (error) {
        console.log(error.stack);
    }

    notificationObject.save().then(function (savedNotification) {
        console.log("saved notification");
        v1.notification.sendPush(notificationObject);

    }, function (error) {
        console.log("error saving friend notification: " + error.message);
    });
};

