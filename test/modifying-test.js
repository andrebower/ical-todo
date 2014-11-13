/**
 * Created by aab on 12.11.2014.
 */
var should = require('chai').should(),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper');

var ics = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
var util = require('util');

describe('Test ical parsing modifiying and creation', function() {
    it('Parsing and stringifiying should be equal to input', function() {
        (new ical.Component(ical.parse(ics))).toString().should.equal(ics);

    });
    it('Parsing and reading vtodo', function() {
        var comp = new ical.Component(ical.parse(ics));
        var vtodos = comp.getAllSubcomponents('vtodo');
        var vtodoString = fs.readFileSync('./test/test-ics/vtodo.txt',{encoding:'utf8'});
        vtodoString = vtodoString.replace(/\r\n|\n/g,'\r\n');
        vtodos.toString().should.equal(vtodoString);
    });
    it('Parsing and modifiying vtodo', function() {
        var comp = new ical.Component(ical.parse(ics));
        var vtodos = comp.getAllSubcomponents('vtodo');
        var vtodoDoneOnceString = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        var newvtodo = new ical.Component(ical.parse(vtodos[0].toString()));
        newvtodo.removeProperty('rrule');
        newvtodo.addPropertyWithValue('status','COMPLETED');
        var recurIdProp = new ical.Property('recurrence-id');
        var time = new ical.Time.fromJSDate(new Date(2014,10,12,10));
        recurIdProp.setValue(time);
        recurIdProp.setParameter('tzid','Europe/Berlin');
        newvtodo.addProperty(recurIdProp);
        var completedIdProp = new ical.Property('completed');
        var time = new ical.Time.fromJSDate(new Date(2014,10,12,09,47,49),'Z');
        completedIdProp.setValue(time);
        completedIdProp.removeParameter('VALUE');
        newvtodo.addProperty(completedIdProp);
        newvtodo.addPropertyWithValue('PERCENT-COMPLETE','100');
        newvtodo.addPropertyWithValue('SEQUENCE','1');
        comp.addSubcomponent(newvtodo);
        comp.toString().should.equal(vtodoDoneOnceString);
    });
});