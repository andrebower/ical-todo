/**
 * Created by aab on 14.11.2014.
 */
"use strict";
var fs = require('../../test/test-helper/fs-test-helper');
var xmldoc = require('xmldoc');
var async = require('async');
var http = require('http');
var queryTodosString = '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">\n' +
    '<d:prop>\n' +
    '<d:getetag />\n' +
    '</d:prop>\n' +
    '<c:filter> \n' +
    '<c:comp-filter name="VCALENDAR" >\n' +
    '<c:comp-filter name="VTODO" />\n' +
    '</c:comp-filter>\n' +
    '</c:filter> \n' +
    '</c:calendar-query>';

var createHttpOptions = function (method, suffix) {
    var result = {
        auth: options.auth,
        hostname: options.hostname,
        port: options.port,
        path: options.path + suffix,
        method: method,
        headers: {'Depth': 1, 'Prefer': 'return-minimal', 'Content-Type': 'application/xml; charset=utf-8'}
    }
};
var queryAllTaskIds = function (callback) {
    var requestOptions = createHttpOptions('REPORT', '');
    var request = http.request(options, function (result) {
        console.log('STATUS: ' + result.statusCode);
        console.log('HEADERS: ' + JSON.stringify(result.headers));
        result.setEncoding('utf8');
        var body = '';
        result.on('data', function (chunk) {
            body += chunk;
            console.log('BODY: ' + chunk);
        });
        result.on('end', function () {
            var responses = [];
            var document = new xmldoc.XmlDocument(body);
            document.eachChild(function (child, index, array) {
                var href = child.childNamed('d:href').val;
                var id = href.split('/').last().split('.')[0];
                var etag = child.childNamed('d:propstat').childNamed('d:prop').childNamed('d:getetag').val.replace(/"/g, "");
                responses.push({file_id: id, href: href, etag: etag});
            });
            callback(responses);
        });
        result.on('error', function (err) {
            console.log('problem with result: ' + e.message);
            callback([
                {'error': err.message}
            ]);
        });
    });
    request.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback([
            {'error': e.message}
        ]);
    });
    request.write(queryTodo);
    request.end();
};


var queryICSFile = function (id, callback) {
    var requestOptions = createHttpOptions('GET', id + '.ics');
    var request = http.request(options, function (result, error) {
        result.setEncoding('utf8');
        var body = '';
        result.on('data', function (chunk) {
            body += chunk;
        });
        result.on('end', function () {
            callback(body);
        });
    });
    request.end();
};
module.exports = function (options) {
    var options = options;

    var getIcsData = function (url, callback) {
        queryAllTaskIds(function (tasks) {
            var taskQueryFunctions = [];
            tasks.forEach(function (val, index, array) {
                taskQueryFunctions.push(function (callback) {
                    queryICSFile(val.file_id, function (task) {
                        callback(null, {etag:val.etag,iCalData:task});
                    });
                });
            });
            async.parallel(taskQueryFunctions, function (err, results) {
                console.log(results);
                callback(results);
            });
        });
    };
    return {getIcsData: getIcsData};
};

if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    }
}