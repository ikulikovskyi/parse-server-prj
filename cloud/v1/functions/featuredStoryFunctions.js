'use strict';

var _                      = require('underscore');
var format                 = require("string-template");
var ERRORS                 = require('../phrases/errors.json');
var entities               = require('../models/entities');
var entitiesFactory        = require('../models/entitiesFactory');
var featuredStoryFunctions = exports;


/**
 * @api {post} /parse/functions/createFeaturedStory
 * @apiName createFeaturedStory
 * @apiGroup FeaturedStory
 * @apiDescription Creates new FeaturedStory
 *
 * @apiParam {String} storyId Required
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "storyId": "XXXXX"
 *     }
 *
 * @apiSuccess {ParseObject} FeaturedStory
 *
 * @apiSuccessExample Success-Response:
 * {
 *  "result": {
 *    "story": {
 *      "__type": "Pointer",
 *      "className": "Clink",
 *      "objectId": "jkQux3GiuA"
 *    },
 *    "createdAt": "2016-10-03T15:51:39.501Z",
 *    "updatedAt": "2016-10-03T15:51:39.501Z",
 *    "objectId": "BqitkdhIEE",
 *    "__type": "Object",
 *    "className": "FeaturedStory"
 *  }
 * }
 *
 * @apiError storyId Property storyId is required.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "code": 141,
 *       "error": "Property storyId is required"
 *     }
 */
featuredStoryFunctions.create = function (request, response) {
    if (!request.user.get('admin')) {
        response.error(ERRORS.not_permitted);
        return;
    }

    var storyId = request.params.storyId;

    if(!storyId || !_.isString(storyId)){
        response.error(format(ERRORS.property_is_required, 'storyId'));
        return;
    }

    var story =  entities.Story.createWithoutData(storyId);

    entitiesFactory.createFeaturedStory(story)
        .then(function (featuredStory) {
            response.success(featuredStory);
        }, function (e) {
            response.error(e.message);
        });
};