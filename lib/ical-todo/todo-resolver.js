/**
 * Created by aab on 26.11.2014.
 */
"use strict";
var ical = require('../ical');

var completeTodo = function(todo){
    if(todo.data.completed) {
        return;
    }
    todo.data.completed = true;
    var template = todo.iCalData.vtodoTemplate;
    var parent = todo.iCalData.parent;
    updateProperty(template,'status','COMPLETED');
    var completedIdProp = new ical.Property('completed');
    var time = new ical.Time.fromJSDate(new Date(),'Z');
    completedIdProp.setValue(time);
    completedIdProp.removeParameter('VALUE');
    template.addProperty(completedIdProp);
    updateProperty(template,'PERCENT-COMPLETE','100');
    addSequenceIfNeeded(template);
    parent.addSubcomponent(template);
};

var updateProperty = function(vtodo,prop,value) {
    if(vtodo.getFirstProperty(prop)) {
        vtodo.getFirstProperty(prop).setValue(value);
    }else{
        vtodo.addPropertyWithValue(prop,value);
    }
};

var addSequenceIfNeeded = function(vtodo) {
    var sequence = vtodo.getFirstProperty('SEQUENCE');
    if(!sequence) {
        vtodo.addPropertyWithValue('SEQUENCE', '1');
    }
};

module.exports = {
    completeTodo:completeTodo
};