/**
 * Created by aab on 12.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    todoFactory = require('../lib/ical-todo/todo-factory'),
    ical = require('../lib/ical'),
    fs = require('./fs-test-helper');
chai.use(require('chai-datetime'));

var getNotCompletedVtodo = function () {
    var nochNichtErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
    var comp = new ical.Component(ical.parse(nochNichtErledigt));
    var vtodo = comp.getFirstSubcomponent('vtodo');
    return vtodo;
};
describe('Test ical-todo todo creation methods', function() {
    it('createTodoFromScratch should create custom todo objects', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.should.have.property('todo');
        customTodo.should.have.property('vtodo');
    });
    it('createTodoFromScratch should create custom todo object with summary', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.todo.summary.should.equal('Aufgabe die 1 mal erledigt ist');
    });
    it('createTodoFromScratch should create custom todo object with description', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        should.not.exist(customTodo.todo.description);
    });
    it('createTodoFromScratch should create custom todo object with dueDate', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.todo.dueDate.should.equalDate(new Date(2014,10,12,10,00,00));
    });
    it('createTodoFromScratch should create custom todo object with uuid', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.todo.uuid.should.be.a('string');
    });
    it('createTodoFromScratch should create custom todo object with correct vtodo', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.todo.uuid.should.be.a('string');
    });
});