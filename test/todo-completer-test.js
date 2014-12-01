/**
 * Created by aab on 26.11.2014.
 */
"use strict";
var chai = require('chai'),
    should = chai.should(),
    todoFactory = require('../lib/ical-todo/todo-factory'),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper'),
    todoCompleter = require('../lib/ical-todo/todo-completer');
chai.use(require('chai-datetime'));

describe('Test todo-completer', function() {
    it('Test completeTodo on single instance ', function() {
        var vtodoCopiedString = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
        var comp = new ical.Component(ical.parse(vtodoCopiedString));
        var vtodoCopied= comp.getAllSubcomponents('vtodo')[0];
        var customTodo = todoFactory.createTodoFromScratch(vtodoCopied,ical.Time.fromJSDate(new Date(2014,10,12,10,0,0)),'etag');
        todoCompleter.completeTodo(customTodo);
        var expected = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        customTodo.iCalData.parent.getAllSubcomponents('vtodo')[1].getFirstProperty('status').getFirstValue().should.equal('COMPLETED');
        customTodo.iCalData.parent.getAllSubcomponents('vtodo')[1].getFirstProperty('percent-complete').getFirstValue().should.equal('100');
        should.exist(customTodo.iCalData.parent.getAllSubcomponents('vtodo')[1].getFirstProperty('completed').getFirstValue());
    });
    it('Test uncompleteTodo on single instance ', function() {
        var vtodoCopiedString = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
        var comp = new ical.Component(ical.parse(vtodoCopiedString));
        var vtodoCopied= comp.getAllSubcomponents('vtodo')[0];
        var customTodo = todoFactory.createTodoFromScratch(vtodoCopied,ical.Time.fromJSDate(new Date(2014,10,12,10,0,0)),'etag');
        todoCompleter.completeTodo(customTodo);
        todoCompleter.uncompleteTodo(customTodo);
        var expected = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        should.not.exist(customTodo.iCalData.parent.getAllSubcomponents('vtodo')[1].getFirstProperty('status'));
        should.not.exist(customTodo.iCalData.parent.getAllSubcomponents('vtodo')[1].getFirstProperty('percent-complete'));
        should.not.exist(customTodo.iCalData.parent.getAllSubcomponents('vtodo')[1].getFirstProperty('completed'));
    });
});