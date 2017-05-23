'use strict';
var helperService = exports;

helperService.storeFunctionUsing = function (nameFunction, user) {
    var usingHistory = Parse.Object.extend("FunctionUsingHistory");
    var record = new usingHistory();

    record.set("function", nameFunction);
    record.set("user", user);

    record.save(null, {
        useMasterKey: true
    });
};