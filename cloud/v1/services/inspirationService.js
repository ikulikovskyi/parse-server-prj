'use strict';

var userService = require('../services/userService');
var inspirationService = exports;

inspirationService.changeStoryInspirationCounter = function (story, inspiration) {
    var storyCreator = story.get("user");

    if (inspiration.get("archived") == true) {
        story.increment("inspireCount", -1);
        userService.decrementUserCounter(storyCreator, 'inspirationCount');

    } else {
        story.increment("inspireCount");
        userService.incrementUserCounter(storyCreator, 'inspirationCount');
    }
    var relation = story.relation("inspirations");
    relation.add(inspiration);
    story.save();
};