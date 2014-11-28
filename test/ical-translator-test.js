/**
 * Created by aab on 12.11.2014.
 */
"use strict";

var chai = require('chai'),
    should = chai.should(),
    icalTranslator = require('../lib/ical-todo/ical-translator'),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper');


describe('Test ical-translator', function() {
    it('without rrule', function() {
        var vtodoString = fs.readFileSync('./test/test-ics/7c8fbae0-89d7-4492-b7ea-e615db8cc503-no-rrule.ics');
        var allTodos = icalTranslator.getAllTodos(vtodoString, new Date(2014, 10, 28,20), '');
        allTodos.length.should.equal(1);
    });
    it('without rrule', function() {
        var vtodoString = fs.readFileSync('./test/test-ics/7c8fbae0-89d7-4492-b7ea-e615db8cc503-no-rrule.ics');
        var allTodos = icalTranslator.getAllTodos(vtodoString, new Date(2014, 10, 28,10), '');
        allTodos.length.should.equal(0);
    });
});
