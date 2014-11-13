/**
 * Created by aab on 12.11.2014.
 */
var chai = require('chai'),
    should = chai.should(),
    todoFactory = require('../lib/ical-todo/todo-factory'),
    ical = require('../lib/ical'),
    fs = require('./test-helper/fs-test-helper');
chai.use(require('chai-datetime'));

var getNotCompletedVtodo = function () {
    var nochNichtErledigt = fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
    var comp = new ical.Component(ical.parse(nochNichtErledigt));
    var vtodo = comp.getFirstSubcomponent('vtodo');
    return vtodo;
};

var getRepeatingvTodo = function (path) {
    var nochNichtErledigt = fs.readFileSync(path);
    var comp = new ical.Component(ical.parse(nochNichtErledigt));
    var vtodo = comp.getFirstSubcomponent('vtodo');
    return vtodo;
};
describe('Test ical-todo todo creation methods', function() {
    it('createTodoFromScratch should create custom todo objects', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.should.have.property('data');
        customTodo.should.have.property('iCalData');
    });
    it('createTodoFromScratch should create custom todo object with summary', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.data.summary.should.equal('Aufgabe die 1 mal erledigt ist');
    });
    it('createTodoFromScratch should create custom todo object with description', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        should.not.exist(customTodo.data.description);
    });
    it('createTodoFromScratch should create custom todo object with dueDate', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.data.dueDate.should.equalDate(new Date(2014,10,12,10,00,00));
    });
    it('createTodoFromScratch should create custom todo object with uuid', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.data.uuid.should.be.a('string');
    });
    it('createTodoFromScratch should create custom todo object with correct vtodo', function() {
        var vtodo = getRepeatingvTodo('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-factory-test.ics');
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,13,16,00,00)));
        var vtodoCopiedString = fs.readFileSync('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-factory-test.ics');
        var comp = new ical.Component(ical.parse(vtodoCopiedString));
        var vtodoCopied= comp.getAllSubcomponents('vtodo')[1];
        vtodoCopied.updatePropertyWithValue('created',new ical.Time.fromJSDate(new Date()));
        customTodo.iCalData.toString().should.equal(vtodoCopied.toString());
    });
});