/**
 * Created by aab on 13.11.2014.
 */
"use strict";
module.exports = function (options) {
    var moment = require('moment'),
        caldavRequester = require('./caldav/caldav-requester')(options),
        caldavWriter = require('./caldav/caldav-writer')(options),
        icalTanslator = require('./ical-translator'),
        todoResolver = require('./todo-completer');

    var url = url;
    var maxDate = moment(0);
    var calendarCtag = {};
    var todoMap = {};

    var uncompleteTodoWithId = function uncompleteTodoWithId(id,callback) {
        var todo = todoMap[id];
        if (todo.data.completed){
            todoResolver.uncompleteTodo(todo);
            caldavWriter.writeTodo(todo, function (error) {
                if (error && error.etag) {
                    requestAllTodos(function () {
                        uncompleteTodoWithId(id,callback);
                    });
                    return;
                }
                if(error) {
                    typeof callback === 'function' && callback({message:error});
                    return;
                }
                typeof callback === 'function' && callback();
            });
        }
    };

    var completeTodoWithId = function completeTodoWithId(id,callback) {
        var todo = todoMap[id];
        if (!todo.data.completed) {
            todoResolver.completeTodo(todo);
            caldavWriter.writeTodo(todo, function (error) {
                if (error && error.etag) {
                    requestAllTodos(function () {
                        completeTodoWithId(id,callback);
                    });
                    return;
                }
                if(error) {
                    typeof callback === 'function' && callback({message:error});
                    return;
                }
                typeof callback === 'function' && callback();
            });
        }

    };

    var addModificationMethods = function addModificationMethods(todo) {
        var id = todo.data.uuid;
        todo.data.complete = function (callback) {
            completeTodoWithId(id,callback);
        };
        todo.data.uncomplete = function (callback) {
            uncompleteTodoWithId(id,callback);
        }
    };

    var addTodos = function (todos) {
        for (var i = 0; i <= todos.length - 1; i++) {
            var todo = todos[i];
            addModificationMethods(todo);
            todoMap[todo.data.uuid] = todo;
        }
    };

    var requestAllTodos = function (done) {
        todoMap = {};
        caldavRequester.getIcsData(function (icsData) {
            var allTodos = [];
            for (var i = icsData.length - 1; i >= 0; i--) {
                var todosForIcs = icalTanslator.getAllTodos(icsData[i].iCalData, maxDate.toDate(), icsData[i].etag);
                addTodos(todosForIcs);
                for (var j = todosForIcs.length - 1; j >= 0; j--) {
                    allTodos = allTodos.concat(todosForIcs[j].data);
                }
            }
            done();
        });
    };

    exports.getTodo = function (id) {
        return todoMap[id].data;
    };

    exports.getAllTodos = function (untilDate, callback) {
        var sendResult = function () {
            var keys = Object.keys(todoMap);
            var allTodos = keys.map(function (v) {
                return todoMap[v].data;
            });
            var result = allTodos.filter(function (v) {
                return !(moment(v.dueDate).isAfter(moment(untilDate)))
            });
            callback(result);
        };
        if (!maxDate || maxDate.isBefore(moment(untilDate))) {
            maxDate = moment(untilDate);
            requestAllTodos(function () {
                sendResult();
            });
            return;
        }
        caldavRequester.getCtag(function (newCtag) {
            if (newCtag === calendarCtag) {
                sendResult();
                return;
            }
            calendarCtag = newCtag;
            requestAllTodos(function () {
                sendResult();
            });
        });
    };
    return exports;
};