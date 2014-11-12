var ical = require('./lib/ical'),
    uuid = require('node-uuid');

var map = {};

var getAllOpenTodos = function(input,until){
    if(!until instanceof Date) {
        throw 'Second parameter has to be a date'
    }
    var component = new ical.Component(ical.parse(input));
    var vtodos = component.getAllSubcomponents('vtodo');
    var rrule = vtodos[0].getFirstPropertyValue("rrule");
    var dtstart = vtodos[0].getFirstPropertyValue("dtstart");
    var iter = rrule.iterator(dtstart);
    var next, result = [];
    do{
        next = iter.next() ;
        var  existingtodo;
        if(existingtodo = getTodoWithRecurrenceId(vtodos,next)) {
            result.push(existingtodo);
        }
    }while( next && next.compare(ical.Time.fromJSDate(until)) <= 0 );
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