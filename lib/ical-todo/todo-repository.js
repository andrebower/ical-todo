/**
 * Created by aab on 13.11.2014.
 */
"use strict";

var caldavRequester = require('./caldav-requester');
var icalTanslator = require('./ical-translator');

var todoMap = {};

var handleTodosForIcs = function(todos){
	for (var i = todos.length - 1; i >= 0; i--) {
		var todo = todos[i];
		todoMap[todo.data.uuid]= todo;
	};
};

var getAllTodos = function(url,untilDate){
    var icsData = caldavRequester.getIcsData(url);
    var allTodos = [];
    console.log(icsData.length);
    for (var i = icsData.length - 1; i >= 0; i--) {
    	var todosForIcs = icalTanslator.getAllOpenTodos(icsData[i],untilDate);
    	handleTodosForIcs(todosForIcs);
    	allTodos = allTodos.concat(todosForIcs.data);
    	console.log(todosForIcs);
    };
    return allTodos;
};

module.exports = {
    getAllTodos:getAllTodos
};