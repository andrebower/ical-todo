/**
 * Created by aab on 13.11.2014.
 */
"use strict";
module.exports = function (options) {
    var moment = require('moment'),
        caldavRequester = require('./caldav-requester'),
        icalTanslator = require('./ical-translator');

    var url = url;
    var maxDate = moment(0);

    var todoMap = {};

    var handleTodosForIcs = function (todos) {
        for (var i = 0; i <= todos.length - 1; i++) {
            var todo = todos[i];
            todoMap[todo.data.uuid] = todo;
        }
    };

    function isEmpty(map) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    var requestAllTodos = function (url,done) {
        caldavRequester.getIcsData('url',function(icsData){
            var allTodos = [];
            for (var i = icsData.length - 1; i >= 0; i--) {
                var todosForIcs = icalTanslator.getAllTodos(icsData[i], maxDate.toDate());
                handleTodosForIcs(todosForIcs);
                for (var j = todosForIcs.length - 1; j >= 0; j--) {
                    allTodos = allTodos.concat(todosForIcs[j].data);
                }
            }
            done();
        });
    };

    var getAllTodos = function (untilDate,callback) {
        var sendResult = function() {
            var keys = Object.keys(todoMap);
            var allTodos = keys.map(function (v) {
                return todoMap[v].data;
            });
            var result =  allTodos.filter(function (v) {
                return !(moment(v.dueDate).isAfter(moment(untilDate)))
            });
            callback(result);
        };
        if(!maxDate || maxDate.isBefore(moment(untilDate))) {
            maxDate = moment(untilDate) ;
            requestAllTodos(url,function(){
                sendResult();
            });
            return;
        }
        sendResult();
    };

    return {getAllTodos:getAllTodos};
};