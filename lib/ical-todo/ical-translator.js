/**
 * Created by aab on 13.11.2014.
 */
'use strict';
var ical = require('../ical'),
    todoFactory = require('./todo-factory');

var COMPLETED = 'COMPLETED';

var isCompleted = function (existingTodo) {
    return existingTodo.getFirstProperty('status') && existingTodo.getFirstProperty('status').getFirstValue() === COMPLETED;
};

var getTodoWithRecurrenceId = function (todos, recurrenceId) {
    for (var i = 0; i < todos.length; i++) {
        var val = todos[i];
        if (!val.getFirstProperty('recurrence-id')) {
            continue;
        }
        if (val.getFirstProperty('recurrence-id').getFirstValue().toICALString() === recurrenceId.toICALString()) {
            return val;
        }
    }
    return null;
};

var getAllOpenTodos = function (input, until) {
    if (!(until instanceof Date)) {
        throw 'Second parameter has to be a date';
    }
    var component = new ical.Component(ical.parse(input)),
        vtodos = component.getAllSubcomponents('vtodo'),
        rrule = vtodos[0].getFirstPropertyValue("rrule"),
        dtstart = vtodos[0].getFirstPropertyValue("dtstart"),
        iter = rrule.iterator(dtstart),
        next = iter.next(),
        result = [];
    while (next && next.compare(ical.Time.fromJSDate(until)) <= 0) {
        var existingTodo = getTodoWithRecurrenceId(vtodos, next);
        if (existingTodo && isCompleted(existingTodo)) {
            next = iter.next();
            continue;
        }
        var newTodo;
        if (existingTodo) {
           newTodo = todoFactory.createTodoFromExisting(existingTodo);
        } else {
            newTodo = todoFactory.createTodoFromScratch(vtodos[0], next);
        }
        result.push(newTodo);
        next = iter.next();
    }
    return result;

};


module.exports = {
    getAllOpenTodos: getAllOpenTodos,
    getTodoWithRecurrenceId: getTodoWithRecurrenceId,
    isCompleted: isCompleted
};