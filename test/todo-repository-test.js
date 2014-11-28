/**
 * Created by aab on 12.11.2014.
 */

"use strict";

var chai = require('chai'),
    should = chai.should(),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper'),
    proxyquire = require('proxyquire');
chai.use(require('chai-datetime'));


describe('Test todo-repository', function () {
    it('test if mocking of caldav-requester works', function (done) {
        var caldavRequesterMock = function () {
            return {getIcsData: function (callback) {
                var result = [];
                result.push({etag: 'bla', iCalData: fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics')});
                callback(result);
            },
                getCtag: function () {
                    return '';
                }}
        };
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav/caldav-requester': caldavRequesterMock})('');

        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11), function (result) {
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141112T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 12, 10), completed: true};
            result.should.be.instanceof(Array);
            done();
        });
    });
    it('test getAllTodos first is completed', function (done) {
        var caldavRequesterMock = function (options) {
            return {getIcsData: function (callback) {
                var result = [];
                result.push({etag: 'bla', iCalData: fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics')});
                callback(result);
            },
                getCtag: function () {
                    return '';
                }}
        };
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav/caldav-requester': caldavRequesterMock})('');
        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11), function (result) {
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141112T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 12, 10), completed: true};
            result[0].uuid.should.eql(expected.uuid);
            result[0].summary.should.eql(expected.summary);
            result[0].startDate.should.eql(expected.dueDate);
            result[0].completed.should.eql(expected.completed);
            done();
        });
    });
    it('test getAllTodos fifthOpen is correct', function (done) {
        var caldavRequesterMock = function () {
            return {getIcsData: function (callback) {
                var result = [];
                result.push({etag: 'bla', iCalData: fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics')});
                callback(result);
            },
                getCtag: function () {
                    return '';
                }}
        };
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav/caldav-requester': caldavRequesterMock})('');
        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11), function (result) {
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141117T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 17, 10), completed: false};
            result[5].uuid.should.eql(expected.uuid);
            result[5].summary.should.eql(expected.summary);
            result[5].startDate.should.eql(expected.dueDate);
            result[5].completed.should.eql(expected.completed);
            result[5].should.have.property('complete');
            done();
        });
    });
});