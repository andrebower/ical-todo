/**
 * Created by aab on 14.11.2014.
 */
"use strict";
var xmldoc = require('xmldoc'),
    async = require('async'),
    http = require('http'),
    optionsCreator = require('./caldav-http-options-creator'),
    queryTodosString = '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">\n' +
        '<d:prop>\n' +
        '<d:getetag />\n' +
        '</d:prop>\n' +
        '<c:filter> \n' +
        '<c:comp-filter name="VCALENDAR" >\n' +
        '<c:comp-filter name="VTODO" />\n' +
        '</c:comp-filter>\n' +
        '</c:filter> \n' +
        '</c:calendar-query>',
    queryCtagString = '<d:propfind xmlns:d="DAV:" xmlns:cs="http://calendarserver.org/ns/">\n' +
        '<d:prop>\n' +
        '<d:displayname />\n' +
        '<cs:getctag />\n' +
        '</d:prop>\n' +
        '</d:propfind>';

module.exports = function (options) {

    var options = options;
    var queryAllTaskIds = function (callback) {
        var headers = {'Depth': 1, 'Prefer': 'return-minimal', 'Content-Type': 'application/xml; charset=utf-8'};
        var requestOptions = optionsCreator.createHttpOptions(options, 'REPORT', headers, '');
        var request = http.request(requestOptions, function (result) {
            result.setEncoding('utf8');
            var body = '';
            result.on('data', function (chunk) {
                body += chunk;
            });
            result.on('end', function () {
                var responses = [];
                var document = new xmldoc.XmlDocument(body);
                document.eachChild(function (child, index, array) {
                    var href = child.childNamed('d:href').val;
                    var urlSplit = href.split('/');
                    var id = urlSplit[urlSplit.length - 1].split('.')[0];
                    var etag = child.childNamed('d:propstat').childNamed('d:prop').childNamed('d:getetag').val.replace(/"/g, "");
                    responses.push({file_id: id, href: href, etag: etag});
                });
                callback(responses);
            });
            result.on('error', function (err) {
                console.log('problem with result: ' + e.message);
                callback(null,
                    {'error': err.message}
                );
            });
        });
        request.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            callback(null,
                {'message': e.message}
            );
        });
        request.write(queryTodosString);
        request.end();
    };


    var queryICSFile = function (id, callback) {
        var headers = {'Depth': 1, 'Prefer': 'return-minimal', 'Content-Type': 'application/xml; charset=utf-8'};
        var requestOptions = optionsCreator.createHttpOptions(options, 'GET', headers, id + '.ics');
        var request = http.request(requestOptions, function (result, error) {
            result.setEncoding('utf8');
            var body = '';
            result.on('data', function (chunk) {
                body += chunk;
            });
            result.on('end', function () {
                callback(body);
            });
        });
        request.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            callback([
                {'error': e.message}
            ]);
        });
        request.end();
    };

    exports.getIcsData = function (callback) {
        queryAllTaskIds(function (tasks,error) {
            if(error) {
                callback(null,error);
                return;
            }
            var taskQueryFunctions = [];
            tasks.forEach(function (val, index, array) {
                taskQueryFunctions.push(function (callback) {
                    queryICSFile(val.file_id, function (task) {
                        callback(null, {etag: val.etag, iCalData: task});
                    });
                });
            });
            async.parallel(taskQueryFunctions, function (err, results) {
                callback(results);
            });
        });
    };
    exports.getCtag = function (callback) {
        var headers = {'Depth': 0, 'Prefer': 'return-minimal', 'Content-Type': 'application/xml; charset=utf-8'};
        var requestOptions = optionsCreator.createHttpOptions(options, 'PROPFIND', headers, '');
        var request = http.request(requestOptions, function (result) {
            result.setEncoding('utf8');
            var body = '';
            result.on('data', function (chunk) {
                body += chunk;
            });
            result.on('end', function () {
                var document = new xmldoc.XmlDocument(body);
                var ctag = document.childNamed('d:response').childNamed('d:propstat').childNamed('d:prop').childNamed('cs:getctag').val;
                callback(ctag);
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
        request.write(queryCtagString);
        request.end();
    };

    return exports;
}
;
