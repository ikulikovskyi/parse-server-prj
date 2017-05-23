'use strict';

var entities             = require('../models/entities');
var entitiesFactory      = require('../models/entitiesFactory');
var constants            = require('../constants');
var trendingStoryService = exports;

trendingStoryService.checkTrendingStory = function (story) {
    var score = getScore(story);

    if (score == constants.TRENDING_STORY_SCORE) {
        entitiesFactory.createTrendingStory(story, score)
            .then(function () {
                console.log('success | saved new TrendingStory');
            }, function (e) {
                console.log(e.message);
            });
    }
};

trendingStoryService.checkIsExistByStory = function (story) {
    var promise = new Parse.Promise();
    var query = new Parse.Query(entities.TrendingStory);

    query.equalTo('story', story);
    return query.first(function (trendingStory) {
        promise.resolve(trendingStory);
    }, function (e) {
        promise.reject(e.message);
    });
    return promise;
};

function getScore(story) {
    var viewCount = story.get('viewCount') || 0;
    var inspireCount = story.get('inspireCount') || 0;
    var commentCount = story.get('commentCount') || 0;

    return viewCount + inspireCount + commentCount;
}