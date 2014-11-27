/**
 * Created by aab on 26.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper'),
    proxyquire = require('proxyquire');
chai.use(require('chai-datetime'));

describe('Test todo-resolver', function() {
    it('', function(done) {
        var caldavRequesterMock = function () {
            return {getIcsData: function (callback) {
                var result = [];
                result.push({etag:'bla',iCalData:fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics')});
                callback(result);
            },
                getCtag : function() {
                    return '';
                }}
        };
        var todoRepoWithMockedRequester = proxyquire('../lib/ical-todo/todo-repository', {'./caldav/caldav-requester': caldavRequesterMock})('');

        todoRepoWithMockedRequester.getAllTodos(new Date(2014, 11, 29, 11), function (result) {
            result[5].complete();
            var expected = {uuid: '79fe94ee-5524-46bd-b5e6-4fdec65c1f01-20141112T100000', summary: 'Aufgabe die 1 mal erledigt ist', dueDate: new Date(2014, 10, 12, 10), completed: true};
            console.log(result[5]);
            result[5].completed.should.equal(expected.completed);
            done();
        });
    });
});