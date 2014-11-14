/**
 * Created by aab on 13.11.2014.
 */
"use strict";

var caldavRequester = require('./caldav-requester');

var vTodoMap = {};


module.exports = {
	
    getAllTodos:function(url){
    	return caldavRequester.getIcsData(url);
    },
    get:function(k){
    	return map[k];
    }


};