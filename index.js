"use strict";


var repoFunction = require('./lib/ical-todo/todo-repository');
var moment = require('moment');

var optionFields = ['auth','path','hostname'];



module.exports = function (options) {
    for (var i = 0; i < optionFields.length; i++) {
        var optionFieldName = optionFields[i];
        if(options[optionFieldName] === undefined) {
            throw "options needs auth hostname path and port fields";
        }
    }
    var repo = repoFunction(options);
    var getAllCurrentTodos = function getAllCurrentTodos(callback) {
        var currentDate = moment().add(1,'d').hours(0).minutes(0).seconds(0).milliseconds(0);
        repo.getAllTodos(currentDate.toDate(),function(result){
              callback(result);
        });
    };

    return {getAllCurrentTodos :getAllCurrentTodos};
};
