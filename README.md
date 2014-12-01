icalendar-todo
===========

This module is based on the mozilla-common/ical module. I will add all the features I need to work with VTODOs including parsing, creating .ics files and completing TODOs. The main target is to make the data compatible with Mozilla's Ligthning plugin for Thunderbird.

Version 0.0.1
===========

Create with

	var options = {
		auth:'<username>:<password>',
		hostname:'<Servername/IP>',
		path:'/owncloud/remote.php/caldav/calendars/<username>/<calendarname>/'
	};
	var icalendarTodo = require('ical-todo')(options);
	

Request all Todos until today

	icalendarTodo.getAllCurrentTodos(function(result) {});
	
Request single Todo
	
	icalendarTodo.getTodo(id,function(result) {});
	
Fields of Todo objects ([]=optional)

	{
		uuid:"Id by combining uid of VTODO and Recurrence-ID: 'uid'-'Recurrence-Id'",
		summary:"Summary",
		[description]: "Optional Description",
		completed:"True or False",
		complete: //Function to complete the Todo,
		startDate:"Start Date of Todo"
	}
Operations of Todo objects

	todo.complete([callback])	//Sets completed = true and writes it back to server. callback takes an errror 							//argument which is null if erverything worked
	todo.uomplete([callback])	//Sets completed = false and writes it back to server. callback same as above
