/**
 * Created by aab on 12.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    todoRepo = require('../lib/ical-todo/todo-repository'),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper');
chai.use(require('chai-datetime'));


describe('Test todo-repository', function() {
    it('test map single instance', function() {
        todoRepo.set('a','a');
        var rep = require('../lib/ical-todo/todo-repository');
        rep.get('a').should.equal('a');
    });
});