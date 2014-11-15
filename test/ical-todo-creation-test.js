/**
 * Created by aab on 12.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    icalTodo = require('../index'),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper');


describe('Test ical-todo todo creation methods', function() {
    it('getTodoWithRecurrenceId should find correct todo', function() {
        var einMalErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        var comp = new ical.Component(ical.parse(einMalErledigt));
        var vtodos = comp.getAllSubcomponents('vtodo');
        var vtodo = icalTodo.getTodoWithRecurrenceId(vtodos,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        vtodo.should.equal(vtodos[1]);
    });
    it('getAllTodos in one year(till 2015-11-12-0759)', function() {
       var nochNichtErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
       var opentodos = icalTodo.getAllTodos(nochNichtErledigt,new Date(2015,10,12,7,59));
       opentodos.should.have.length(365);
    });
    it('getAllodos in one year(till 2015-11-12-0759) without the completed one', function() {
        var nochNichtErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics');
        var opentodos = icalTodo.getAllTodos(nochNichtErledigt,new Date(2015,10,12,7,59));
        opentodos.should.have.length(365);
    });
    it('getAllTodos in one year(till 2015-11-12-0759) with a copied one only 2 repeats', function() {
        var nochNichtErledigt = fs.readFileSync('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var opentodos = icalTodo.getAllTodos(nochNichtErledigt,new Date(2015,10,12,7,59));
        opentodos.should.have.length(2);
    });
});