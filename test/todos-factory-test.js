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
    return getFirstvTodo('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-not-completed.ics');
};

var getFirstvTodo = function (path) {
    var nochNichtErledigt = fs.readFileSync(path);
    var comp = new ical.Component(ical.parse(nochNichtErledigt));
    var vtodo = comp.getFirstSubcomponent('vtodo');
    return vtodo;
};
var getSecondvTodo = function (path) {
    var nochNichtErledigt = fs.readFileSync(path);
    var comp = new ical.Component(ical.parse(nochNichtErledigt));
    var vtodo = comp.getAllSubcomponents('vtodo')[1];
    return vtodo;
};
describe('Test ical-todo todo creation methods', function() {
    it('createTodoFromScratch should create custom todo objects', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.should.have.property('data');
        customTodo.data.should.have.property('uuid');
        customTodo.data.should.have.property('summary');
        customTodo.data.should.have.property('startDate');
        customTodo.data.should.have.property('completed');
        customTodo.data.should.not.have.property('complete');
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
    it('createTodoFromScratch should create custom todo object with startDate', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.data.startDate.should.equalDate(new Date(2014,10,12,10,00,00));
    });
    it('createTodoFromScratch should create custom todo object with uuid', function() {
        var vtodo = getNotCompletedVtodo();
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,12,10,00,00)));
        customTodo.data.uuid.should.be.a('string');
    });
    it('createTodoFromScratch should create custom todo object with correct vtodo', function() {
        var vtodo = getFirstvTodo('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,13,16,00,00)));
        var vtodoCopiedString = fs.readFileSync('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var comp = new ical.Component(ical.parse(vtodoCopiedString));
        var vtodoCopied= comp.getAllSubcomponents('vtodo')[1];
        vtodoCopied.updatePropertyWithValue('created',new ical.Time.fromJSDate(new Date()));
        customTodo.iCalData.vtodoTemplate.toString().should.equal(vtodoCopied.toString());
    });
    it('createTodoFromScratch should create custom todo object with correct iCalData uid', function() {
        var vtodo = getFirstvTodo('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var customTodo = todoFactory.createTodoFromScratch(vtodo,ical.Time.fromJSDate(new Date(2014,10,13,16,00,00)));
        customTodo.iCalData.uid.should.equal('3e65ac8d-a35c-4c53-acc0-d98906be436b');
    });
    it('createTodoFromExisting should create custom todo object with correct vtodo', function() {
        var vtodo = getSecondvTodo('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var customTodo = todoFactory.createTodoFromExisting(vtodo,ical.Time.fromJSDate(new Date(2014,10,13,16,00,00)));
        var vtodoCopiedString = fs.readFileSync('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var comp = new ical.Component(ical.parse(vtodoCopiedString));
        var vtodoCopied= comp.getAllSubcomponents('vtodo')[1];
        customTodo.iCalData.vtodoTemplate.toString().should.equal(vtodoCopied.toString());
    });
    it('createTodoFromExisting should create custom todo object with vtodo with correct parent', function() {
        var vtodo = getSecondvTodo('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var customTodo = todoFactory.createTodoFromExisting(vtodo,ical.Time.fromJSDate(new Date(2014,10,13,16,00,00)));
        var vtodoCopiedString = fs.readFileSync('./test/test-ics/3e65ac8d-a35c-4c53-acc0-d98906be436b-just-copied.ics');
        var comp = new ical.Component(ical.parse(vtodoCopiedString));
        customTodo.iCalData.parent.toString().should.equal(comp.toString());
    });
});