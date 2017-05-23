require('easy-pid-file')('process-pid.pid');

var express = require('express');
var path = require('path');
var ParseServer = require('parse-server').ParseServer;
var S3Adapter = require('parse-server').S3Adapter;
var SimpleMailgunAdapter = require('parse-server-simple-mailgun-adapter');
var fs = require('fs');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var facebookAppIds = process.env.FACEBOOK_APP_IDS;
if (facebookAppIds) {
    facebookAppIds = facebookAppIds.split(",");
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337',  // Don't forget to change to https if needed
    clientKey: process.env.CLIENT_KEY,
    restAPIKey: process.env.CLIENT_KEY,
    javascriptKey: process.env.CLIENT_KEY,    
    facebookAppIds: facebookAppIds,
    fileKey: process.env.FILE_KEY,
    appName: process.env.APP_NAME,
    publicServerURL: process.env.SERVER_URL,

    oauth: {
        twitter: {
            consumer_key: process.env.TWITTER_CONSUMER_KEY, // REQUIRED
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET // REQUIRED
        },
        facebook: {
            appIds: facebookAppIds
        }
    },

    push: {
        ios: [
            {
                pfx: __dirname + process.env.DEV_PUSH_CERT,
                bundleId: process.env.IOS_BUNDLE_ID,
                production: false
            },
            {
                pfx: __dirname + process.env.PROD_PUSH_CERT,
                bundleId: process.env.IOS_BUNDLE_ID,
                production: true
            }
        ]
    },

    filesAdapter: new S3Adapter(
        process.env.S3_ACCESS_KEY,
        process.env.S3_SECRET_KEY,
        process.env.S3_BUCKET,
        {directAccess: true}
    ),

    emailAdapter: SimpleMailgunAdapter({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
        fromAddress: process.env.MAILGUN_FROM_ADDRESS
    })
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Running Apidoc
try {
    app.use('/apidoc', express.static(path.join(__dirname, '/apidoc')));
}
catch (error) {
    console.log(error.stack);
}

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

//public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
});
