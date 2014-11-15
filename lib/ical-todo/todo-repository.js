/**
 * Created by aab on 13.11.2014.
 */
"use strict";
module.exports = function(url){
	var moment = require('moment'),
		caldavRequester = require('./caldav-requester'),
		icalTanslator = require('./ical-translator');
	
	var url = url;
	var maxDate = moment().add(1,'y');

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

	var requestAllTodos =  function(){
		var icsData = caldavRequester.getIcsData('url');
	    var allTodos = [];
	    for (var i = icsData.length - 1; i >= 0; i--) {
	    	var todosForIcs = icalTanslator.getAllTodos(icsData[i],maxDate.toDate());
	    	handleTodosForIcs(todosForIcs);
	    	for (var i = todosForIcs.length - 1; i >= 0; i--) {
	    		allTodos = allTodos.concat(todosForIcs[i].data);
	    	};
	    };
	}

	var getAllTodos = function(untilDate){
	    if(isEmpty(todoMap)){
	    	requestAllTodos(url,untilDate);
	    }
	    var keys = Object.keys(todoMap);
	    var allTodos = keys.map(function(v) { return todoMap[v].data; });
	    return allTodos.filter(function(v){return !(moment(v.dueDate).isAfter(moment(untilDate)))});

	};

    return {getAllTodos:getAllTodos};
};