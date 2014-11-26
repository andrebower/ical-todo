"use strict";


var repoFunction = require('./lib/ical-todo/todo-repository');
var moment = require('moment');




module.exports = function (options) {
    var repo = repoFunction(options);
    var getAllCurrentTodos = function getAllCurrentTodos(callback) {
        var currentDate = moment();
        repo.getAllTodos(currentDate.toDate(),function(result){
              callback(result);
        });
    };

    return {getAllCurrentTodos :getAllCurrentTodos};
};
module.exports('test');