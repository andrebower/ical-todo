"use strict";
var repo = require('./lib/ical-todo/todo-repository')('url');

repo.getAllTodos(new Date(2014, 11, 29, 11),function(result){
    console.log(result);
});
setTimeout(function(){
    console.log('Waited');
},40000);
