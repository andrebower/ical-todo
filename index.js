var ical = require('./lib/ical'),
    uuid = require('node-uuid');

var map = {};

var getAllOpenTodos = function(input,until){
    if(!until.instanceOf(Date)) {
        throw 'Second parameter has to be a date'
    }
    var component = ical.Component(ical.parse(input));
    var vtodos = component.getAllSubcomponents('vtodo');
    var rrule = vtodos.getFirstPropertyValue("rrule");
    var dtstart = vtodos.getFirstPropertyValue("dtstart");
    var iter = rrule.iterator(dtstart);
    var next, result = [];
    while(next = iter.next()){
        var  existingtodo;
        if(existingtodo = getTodoWithRecurrenceId(vtodos,next)) {
            result.push(existingtodo);
        }
    }
    return result

};

var getTodoWithRecurrenceId =  function(todos,recurrenceId) {
    for (var i = 0; i < todos.length; i++) {
        var val = todos[i];
        if(!val.getFirstProperty('recurrence-id')) {
            continue;
        }
        if(val.getFirstProperty('recurrence-id').getFirstValue().toICALString() === recurrenceId.toICALString()) {
            return val;
        }
    }
    return null;
};

function createTodo(vtodo) {

}

module.exports = {
    getAllOpenTodos:getAllOpenTodos,
    getTodoWithRecurrenceId:getTodoWithRecurrenceId
};