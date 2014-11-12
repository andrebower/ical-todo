/**
 * Created by aab on 12.11.2014.
 */
var should = require('chai').should(),
    icalTodo = require('../index'),
    ical = require('../lib/ical'),
    fs = require('fs');

var ics = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-ein-mal-erledigt.ics',{encoding :'utf8'});

describe('Test ical-todo todo creation methods', function() {
    it('getTodoWithRecurrenceId should find correct todo', function() {
        var comp = new ical.Component(ical.parse(ics));
        var vtodos = comp.getAllSubcomponents('vtodo');
        var vtodo = icalTodo.getTodoWithRecurrenceId(vtodos,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        vtodo.should.equal(vtodos[1]);
    });
    it('getAllOpenTodos ', function() {
       var opentodos = icalTodo.getAllOpenTodos(ics,new Date());
        console.log(opentodos);

    });
});