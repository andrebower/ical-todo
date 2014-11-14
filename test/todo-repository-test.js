/**
 * Created by aab on 12.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    todoRepo = require('../lib/ical-todo/todo-repository'),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper'),
    proxyquire = require('proxyquire');
chai.use(require('chai-datetime'));


describe('Test todo-repository', function () {
    it('test map single instance', function () {
        var caldavRequesterMock = {};
        todoRepo = proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock});
        caldavRequesterMock.getIcsData = function (url) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            return result;
        };
        todoRepo.getAllTodos().should.be.instanceof(Array);
    });
});