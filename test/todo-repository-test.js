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
    it('test if mocking of caldav-requester works', function () {
        var caldavRequesterMock = {};
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock});
        caldavRequesterMock.getIcsData = function (url) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            return result;
        };
        todoRepoWithMockedRequester.getAllTodos('not needed because of mock',new Date(2014,11,29,11)).should.be.instanceof(Array);
    });
    it('test getAllTodos firstOpen is correct', function () {
        var caldavRequesterMock = {},
             uuidMock = require('node-uuid');
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock,'node-uuid':uuidMock});
        caldavRequesterMock.getIcsData = function (url) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            return result;
        };
        uuidMock.v4 = (function(){
            var i = 0;
            return function(){
                i++;
                return ''+i;

            }
        })();
        var firstOpen = todoRepoWithMockedRequester.getAllTodos('not needed because of mock',new Date(2014,11,29,11))[0];
        var expected = {uuid:'1',summary:'Aufgabe die 1 mal erledigt ist',dueDate:new Date(2014,10,13,10),completed:false};
        firstOpen.should.eql(expected);
    });
    it('test getAllTodos fifthOpen is correct', function () {
        var caldavRequesterMock = {},
             uuidMock = require('node-uuid');
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav-requester': caldavRequesterMock,'node-uuid':uuidMock});
        caldavRequesterMock.getIcsData = function (url) {
            var result = [];
            result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics'));
            return result;
        };
        uuidMock.v4 = (function(){
            var i = 0;
            return function(){
                i++;
                return ''+i;

            }
        })();
        var fifthOpen = todoRepoWithMockedRequester.getAllTodos('not needed because of mock',new Date(2014,11,29,11))[4];
        var expected = {uuid:'5',summary:'Aufgabe die 1 mal erledigt ist',dueDate:new Date(2014,10,17,10),completed:false};
        fifthOpen.should.eql(expected);
    });

});