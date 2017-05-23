var entities = require('./v1/models/entities');

//v1
var v1 = {};
v1.story = require('./v1/story');
v1.pushHelper = require('./v1/pushHelper');
v1.fetchStories = require('./v1/fetchStories');
v1.notification = require('./v1/notification');
v1.constants = require('./v1/constants');

Parse.Cloud.define('createComment', v1.story.comment);
Parse.Cloud.define('fetchFollowingStories', v1.fetchStories.fetchFollowingStories);
Parse.Cloud.define('fetchTrendingStories', v1.fetchStories.emptyResult);
Parse.Cloud.define('fetchFeaturedStories', v1.fetchStories.fetchFeaturedStories);
Parse.Cloud.define('fetchRecentStories', v1.fetchStories.fetchRecentStories);
Parse.Cloud.define('fetchUserStories', v1.fetchStories.fetchUserStories);
Parse.Cloud.define('createFeaturedStory', v1.featuredStoryFunctions.create);

//twitterAuthFunctions
var twitterAuthFunctions = require('./v1/functions/twitterAuthFunctions');

Parse.Cloud.define('twitterGetAccessToken', twitterAuthFunctions.getAccessToken);
Parse.Cloud.define('twitterGetRequestUrl', twitterAuthFunctions.getRequestUrl);

//userFunctions
var userFunctions = require('./v1/functions/userFunctions.js');

Parse.Cloud.define('getMentionedUsers', userFunctions.getMentionedUsers)
Parse.Cloud.define('searchUsers', userFunctions.searchUsers);
Parse.Cloud.define('getProfile', userFunctions.getProfile);
Parse.Cloud.define('followUser', userFunctions.followUser);
Parse.Cloud.define('unFollowUser', userFunctions.unFollowUser);
Parse.Cloud.define('fetchFeaturedUsers', userFunctions.fetchFeaturedUsers);
Parse.Cloud.define('updateProfile', userFunctions.updateProfile);

//inspirationFunctions
var inspirationFunctions = require('./v1/functions/inspirationFunctions');
Parse.Cloud.define('createInspiration1', inspirationFunctions.toggleInspiration);

//notificationFunctions
var notificationFunctions = require('./v1/functions/notificationFunctions.js');

Parse.Cloud.define('setLastReadNotification', notificationFunctions.setLastReadNotification);
Parse.Cloud.define('setNotificationRead', notificationFunctions.setNotificationRead);
Parse.Cloud.define('getMyInstallationObject', notificationFunctions.getMyInstallationObject);
Parse.Cloud.define('pushNewAppAvailable', notificationFunctions.pushNewAppAvailable);
Parse.Cloud.define('getNotificationsCount', notificationFunctions.getNotificationsCount);

// ChannelFunctions
var channelsFunctions = require('./v1/functions/channelsFunctions');

Parse.Cloud.define('getChannels', channelsFunctions.getChannels);


// StoryFunctions
var storyFunctions = require('./v1/functions/storyFunctions');

Parse.Cloud.define('incrementStoryViewCount', storyFunctions.incrementStoryViewCount);
Parse.Cloud.define('fetchStoryById', storyFunctions.fetchStoryById);

//handlers
var followHandlers = require('./v1/handlers/followHandlers.js');
var storyHandlers = require('./v1/handlers/storyHandlers.js');
var commentHandlers = require('./v1/handlers/commentHandlers.js');
var userHandlers = require('./v1/handlers/userHandlers.js');
var installationHandlers = require('./v1/handlers/installationHandlers.js');
var trendingStoryHandlers = require('./v1/handlers/trendingStoryHandlers');
var featuredStoryHandlers = require('./v1/handlers/featuredStoryHandlers');
var inspirationHandlers = require('./v1/handlers/inspirationHandlers');

Parse.Cloud.afterSave('Friend', followHandlers.afterSave);
Parse.Cloud.afterSave('Clink', storyHandlers.afterSave);
Parse.Cloud.afterSave('ClinkComment', commentHandlers.afterSave);
Parse.Cloud.afterDelete('Friend', followHandlers.afterDelete);