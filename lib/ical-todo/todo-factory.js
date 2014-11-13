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

var createvTodo = function(vtodo, recurrenceId) {

    var copiedvTodo = new ical.Component(ical.parse(vtodo.toString()));
    copiedvTodo.updatePropertyWithValue('created',new ical.Time.fromJSDate(new Date()));
    copiedvTodo.removeProperty('rrule');
    var tzid = copiedvTodo.getFirstProperty('dtstart').getParameter('tzid');
    var recurProp = new ical.Property('recurrence-id');
    recurProp.setParameter('tzid',tzid);
    recurProp.setValue(recurrenceId);
    copiedvTodo.addProperty(recurProp);
    copiedvTodo.updatePropertyWithValue('dtstart',recurrenceId);
    return copiedvTodo;
};

var createTodoFromScratch = function (vtodo, recurrenceId) {
    var vtodo = createvTodo(vtodo,recurrenceId);
    var todo = createTodo(vtodo,recurrenceId);
    return {data: todo, iCalData: vtodo};
};

module.exports =  {
    createTodoFromScratch:createTodoFromScratch
};