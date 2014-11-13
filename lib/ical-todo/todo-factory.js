/**
 * Created by aab on 13.11.2014.
 */
"use strict";
var ical = require('../ical'),
    uuid = require('node-uuid');

var createTodo = function (vTodo,recurrenceId) {
    var todo = {uuid: uuid.v4()};
    todo.summary = vTodo.getFirstProperty('summary').getFirstValue();
    var descrptionProperty = vTodo.getFirstProperty('description');
    if(descrptionProperty) {
        todo.description = descrptionProperty.getFirstValue();
    }
    todo.dueDate = recurrenceId.toJSDate();
    todo.completed = false;
    return todo;
};

var createvTodo = function(copiedvTodo, recurrenceId) {

};

var createTodoFromScratch = function (vtodo, recurrenceId) {
    var copiedvTodo = new ical.Component(ical.parse(vtodo.toString()));
    copiedvTodo.removeProperty('rrule');
    var todo = createTodo(copiedvTodo,recurrenceId);
    var vtodo = createvTodo(copiedvTodo,recurrenceId);
    return {todo: todo, vtodo: 'bla',
        complete: function () {

        }
    };
};

module.exports =  {
    createTodoFromScratch:createTodoFromScratch
};