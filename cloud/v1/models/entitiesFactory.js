'use strict';

var entities        = require('./entities');
var entitiesFactory = exports;

entitiesFactory.createTrendingStory = function (story, score, notified) {
    var trendingStory = new entities.TrendingStory;
    trendingStory.set('story', story);
    if (score) trendingStory.set('score', score);
    if (notified) trendingStory.set('notified', notified);
    return trendingStory.save();
};

entitiesFactory.createFeaturedStory = function (story) {
    var featuredStory = new entities.FeaturedStory;
    featuredStory.set('story', story);
    return featuredStory.save();
};