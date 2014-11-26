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
        var caldavRequesterMock = {};
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock})('');
        caldavRequesterMock.getIcsData = function (url, callback) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            callback(result);
        };
        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11),function(result){
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141112T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 12, 10), completed: true};
            result.should.be.instanceof(Array);
            done();
        });
    });
    it('test getAllTodos first is completed', function (done) {
        var caldavRequesterMock = {};
        var todoRepoWithMockedRequester =  proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock})('');
        caldavRequesterMock.getIcsData = function (url, callback) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            callback(result);
        };
        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11),function(result){
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141112T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 12, 10), completed: true};
            result[0].should.eql(expected);
            done();
        });
    });
    it('test getAllTodos fifthOpen is correct', function (done) {
        var caldavRequesterMock = {};
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock})('');
        caldavRequesterMock.getIcsData = function (url, callback) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            callback(result);
        };
        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11),function(result){
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141117T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 17, 10), completed: false};
            result[5].should.eql(expected);
            done();
        });
    });
});