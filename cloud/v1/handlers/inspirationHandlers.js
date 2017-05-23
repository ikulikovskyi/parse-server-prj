'use strict';

var entities            = require('../models/entities');
var inspirationService  = require('../services/inspirationService');
var notificationService = require('../services/notificationService');
var inspirationHandlers = exports;

inspirationHandlers.afterSave = function (request) {

    var query = new Parse.Query(entities.Inspiration);
    query.include("story.user");
    query.include("user");

    query.get(request.object.id)
        .then(function (inspiration) {
            var story = inspiration.get("story");

            // change the inspireCount of a story
            inspirationService.changeStoryInspirationCounter(story, inspiration);

            // send notification
            var storyCreator = story.get("user");
            var inspireCreator = inspiration.get("user");

            if (inspiration.get("archived") == false && storyCreator.id != inspireCreator.id) {
                notificationService.sendInspirationNotification(story, inspireCreator, storyCreator);
            }

        }, function (error) {
            console.log(error.message);
        });
};