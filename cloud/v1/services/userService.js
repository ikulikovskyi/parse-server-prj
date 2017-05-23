'use strict';

var _ = require('underscore');
var format = require("string-template");
var ERRORS = require('../phrases/errors.json');
var CONSTANTS = require('../constants');
var storyService = require('../services/storyService');
var entities = require('../models/entities');
var userService = exports;

userService.isUserAuthorithed = function (user) {
    return !!user;
};

userService.isUserBanned = function (user) {
    return !!user.get('banned');
};

userService.getUserCounters = function () {
    return {
        "inspirationCount": {
            'getter': userService.getUserInspirationCount
        },
        "postsCount": {
            'getter': userService.getUserPostsCount
        },
        "followersCount": {
            'getter': userService.getUserFollowersCount
        },
        "followingCount": {
            'getter': userService.getUserFollowingCount
        }
    };
};

userService.getUserInspirationCount = function (user) {
    var promise = new Parse.Promise();

    var Story = Parse.Object.extend("Clink");
    var query = new Parse.Query(Story);
    query.equalTo("user", user);

    query.find().then(function (results) {
        var Inspiration = Parse.Object.extend("Inspiration");
        var query = new Parse.Query(Inspiration);
        query.containedIn("story", results);
        query.equalTo("archived", false);

        query.count().then(function (results) {
            promise.resolve(results);
        });
    }, function (error) {
        promise.reject(error);
    });

    return promise;
};

userService.getUserPostsCount = function (user) {
    var Clink = Parse.Object.extend("Clink");
    var query = new Parse.Query(Clink);
    query.equalTo("user", user);

    return query.count();
};

userService.getUserFollowingCount = function (user) {
    var Friend = Parse.Object.extend("Friend");
    var query = new Parse.Query(Friend);
    query.equalTo("sourceUser", user);

    return query.count();
};

userService.getUserFollowersCount = function (user) {
    var Friend = Parse.Object.extend("Friend");
    var query = new Parse.Query(Friend);
    query.equalTo("user", user);

    return query.count();
};

/* get from cache or calculate and set for profile */
userService.processUsersCounter = function (user, counterName) {
    var countGetter = userService.getUserCounters()[counterName].getter;
    var promise = new Parse.Promise();

    if (typeof user.get(counterName) == "undefined") {
        countGetter(user).then(function (count) {
            user.set(counterName, count);
            promise.resolve({countCalculated: true, countName: counterName});
        }, function (error) {
            promise.reject(error);
        });
    }
    else {
        promise.resolve({countCalculated: false, countName: counterName});
    }

    return promise;
};

/* use after DB finally changed */
userService.incrementUserCounter = function (user, counterName) {
    user.fetch().then(function () {
        userService.processUsersCounter(user, counterName).then(function (result) {
            if (!result.countCalculated) {
                user.increment(counterName, 1);
                user.save(null, {useMasterKey: true});
            }
        });
    });
};

/* use after all data saved  */
userService.decrementUserCounter = function (user, counterName) {
    user.fetch().then(function () {
        userService.processUsersCounter(user, counterName).then(function (result) {
            if (!result.countCalculated) {
                user.increment(counterName, -1);
            }
            user.save(null, {useMasterKey: true});
        });
    });
};

userService.getUserPostsQuotaPerDay = function (user) {

    var promise = new Parse.Promise();

    user.fetch().then(function (userObject) {
        var userLimit = userObject.get('limit');

        if (!_.isUndefined(userLimit) && _.isNumber(userLimit)) {
            promise.resolve(userLimit);
        } else if (process.env.USER_POSTS_QUOTA_PER_DAY) {
            promise.resolve(process.env.USER_POSTS_QUOTA_PER_DAY);
        } else {
            promise.resolve(100);
        }
    }, function (error) {
        promise.reject(error.message);
    });

    return promise;
};

userService.updateUserPostingLimitation = function (user) {
    var promise = new Parse.Promise();

    userService.getUserPostsQuotaPerDay(user).then(function (userPostsQuotaPerDay) {
        storyService.getFirstQuotaPost(user, userPostsQuotaPerDay).then(function (firstQuotaPost) {
            if (firstQuotaPost) {
                var lastLimitedPostCreatedAt = new Date(firstQuotaPost.get('createdAt'));
                lastLimitedPostCreatedAt.setDate(lastLimitedPostCreatedAt.getDate() + 1);

                user.set('postingLimitEnabledTill', {
                    "iso": lastLimitedPostCreatedAt.toJSON()
                });
            }
            else {
                user.set('postingLimitEnabledTill', null);
            }

            user.save(null, {
                useMasterKey: true,
                success: function () {
                    promise.resolve(user);
                },
                error: function (error) {
                    promise.reject(error);
                }
            });

        });

    });

    return promise;
};