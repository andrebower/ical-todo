/**
 * Created by aab on 13.11.2014.
 */
"use strict";

var caldavRequester = require('./caldav-requester');
var icalTanslator = require('./ical-translator');

var todoMap = {};

var handleTodosForIcs = function(todos){
	for (var i = 0; i <= todos.length - 1; i++) {
		var todo = todos[i];
		todoMap[todo.data.uuid]= todo;
	};
};
function isEmpty(map) {
   for(var key in map) {
      if (map.hasOwnProperty(key)) {
         return false;
      }
   }
   return true;
}

var requestAllTodos =  function(url,untilDate){
	var icsData = caldavRequester.getIcsData(url);
    var allTodos = [];
    for (var i = icsData.length - 1; i >= 0; i--) {
    	var todosForIcs = icalTanslator.getAllOpenTodos(icsData[i],untilDate);
    	handleTodosForIcs(todosForIcs);
    	for (var i = todosForIcs.length - 1; i >= 0; i--) {
    		allTodos = allTodos.concat(todosForIcs[i].data);
    	};
    };
}

var getAllTodos = function(url,untilDate){
    if(isEmpty(todoMap)){
    	requestAllTodos(url,untilDate);
    }
    var keys = Object.keys(todoMap);
    return keys.map(function(v) { return todoMap[v].data; });

};

module.exports = {
    getAllTodos:getAllTodos
};