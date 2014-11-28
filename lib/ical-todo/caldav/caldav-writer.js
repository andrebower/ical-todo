/**
 * Created by aab on 27.11.2014.
 */
"use strict";

var http = require('http'),
    optionsCreator = require('./caldav-http-options-creator');

module.exports = function (options) {
    var options = options;
    exports.writeTodo = function writeTodo(todo, callback) {
        var headers = {'Content-Type': 'text/calendar; charset=utf-8', 'If-Match': '"' + todo.iCalData.etag + '"' };
        var requestOptions = optionsCreator.createHttpOptions(options, 'PUT', headers, todo.iCalData.uid + '.ics');
        var request = http.request(requestOptions, function (result) {
            if (result.statusCode == 412) {
                callback({etag: todo.iCalData.etag});
                return;
            }
            if (result.statusCode == 412) {
                callback(undefined);
                return
            }
            callback('Something went wrong');
            return;

        });
        request.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            callback([
                {'error': e.message}
            ]);
        });
        request.write(todo.iCalData.parent.toString());
        request.end();

    };

    return exports;
};
