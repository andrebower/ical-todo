/**
 * Created by aab on 12.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    icalTodo = require('../index'),
    ical = require('../lib/ical'),
    fs = require('./fs-test-helper');


describe('Test ical-todo todo creation methods', function() {
    it('getTodoWithRecurrenceId should find correct todo', function() {
        var einMalErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        var comp = new ical.Component(ical.parse(einMalErledigt));
        var vtodos = comp.getAllSubcomponents('vtodo');
        var vtodo = icalTodo.getTodoWithRecurrenceId(vtodos,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        vtodo.should.equal(vtodos[1]);
    });
    it('getAllOpenTodos in one year(till 2015-11-12-0759)', function() {
       var nochNichtErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
       var opentodos = icalTodo.getAllOpenTodos(nochNichtErledigt,new Date(2015,10,12,7,59));
       opentodos.should.have.length(365);
    });
    it('is completed should return true for completed', function() {
        var einMalErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        var comp = new ical.Component(ical.parse(einMalErledigt));
        var vtodos = comp.getAllSubcomponents('vtodo');
        icalTodo.isCompleted(vtodos[1]).should.be.true;

    });
    it('getAllOpenTodos in one year(till 2015-11-12-0759) without the completed one', function() {
        var nochNichtErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        var opentodos = icalTodo.getAllOpenTodos(nochNichtErledigt,new Date(2015,10,12,7,59));
        opentodos.should.have.length(364);
    });
});