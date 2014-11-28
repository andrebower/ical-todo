/**
 * Created by aab on 26.11.2014.
 */
"use strict";
var ical = require('../ical');

var removeProperty = function removeProperty(vtodo, prop) {
     vtodo.removeProperty(prop);
};

var updateProperty = function(vtodo,prop,value) {
    if(vtodo.getFirstProperty(prop)) {
        vtodo.getFirstProperty(prop).setValue(value);
    }else{
        vtodo.addPropertyWithValue(prop,value);
    }
};

var updateSequence = function(vtodo) {
    var sequence = vtodo.getFirstProperty('sequence');
    if(!sequence) {
        vtodo.addPropertyWithValue('sequence', '1');
        return;
    }
    vtodo.updatePropertyWithValue('sequence',''+ (parseInt(sequence.getFirstValue())+1))
};

var uncompleteTodo = function (todo) {
     if(!todo.data.completed) {
         return;
     }
    todo.data.completed = false;
    var parent = todo.iCalData.parent;
    var vtodo = todo.iCalData.vtodoTemplate;
    removeProperty(vtodo,'status');
    removeProperty(vtodo,'completed');
    removeProperty(vtodo,'percent-complete');
    updateSequence(vtodo);
    parent.addSubcomponent(vtodo);
};

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
    updateProperty(template,'percent-complete','100');
    updateSequence(template);
    parent.addSubcomponent(template);
};



module.exports = {
    completeTodo:completeTodo,
    uncompleteTodo:uncompleteTodo
};