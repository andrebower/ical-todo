/**
 * Created by aab on 26.11.2014.
 */
var ical = require('../ical');

var completeTodo = function(todo){
//    if() wurde schon erledigt dann auf Status incomplete setzen außerdem property für added verwenden TODO
    todo.data.completed = true;
    var template = todo.iCalData.vtodoTemplate;
    var parent = todo.iCalData.parent;
    template.addPropertyWithValue('status','COMPLETED');
    var completedIdProp = new ical.Property('completed');
    var time = new ical.Time.fromJSDate(new Date(),'Z');
    completedIdProp.setValue(time);
    completedIdProp.removeParameter('VALUE');
    template.addProperty(completedIdProp);
    template.addPropertyWithValue('PERCENT-COMPLETE','100');
    template.addPropertyWithValue('SEQUENCE','1');
    parent.addSubcomponent(template);
};

module.exports = {
    completeTodo:completeTodo
};