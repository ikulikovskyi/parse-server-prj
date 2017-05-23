'use strict';

var channelsFunctions = exports;
var userService       = require('./../services/userService.js');
var entities          = require('../models/entities');
var ERRORS            = require('../phrases/errors.json');

/**
 * @api {post} /parse/functions/getChannels
 * @apiName getChannels
 * @apiGroup Channels
 * @apiDescription Get list of Channels
 *
 * @apiSuccessExample Success-Response:
 {
   "result": [
     {
       "user": {
         "displayName": "LuraineFacebook_test",
         "username": "9263910365",
         "nickname": "LuraineFacebook_Rename",
          ...
       "className": "Channel"
     }
   ]
 }
 */
channelsFunctions.getChannels = function (request, response) {
    var query = new Parse.Query(entities.Channel);
    query.include('user');
    query.ascending("order");

    query.find().then(function (results) {
        response.success(results);
    }, function (error) {
        response.error(error.message);
    });
};