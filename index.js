
var ical = require('ical');
ical.objectHandlers['BEGIN'] = function(component, params, curr, stack, line){
	if(component === 'VEVENT'){
		if (curr.vevents == undefined) {
			curr.vevents = [];	
		} 
		stack.push(curr);
	}else if(component === 'VTODO'){
		if (curr.vtodos == undefined) {
			curr.vtodos = [];	
		} 
		stack.push(curr);
		
	}else {
		stack.push(curr)
	}
   	return {type:component, params:params}
};

ical.objectHandlers['END'] = function(component, params, curr, stack){
        // prevents the need to search the root of the tree for the VCALENDAR object
        if (component === "VCALENDAR") {
            //scan all high level object in curr and drop all strings
            var key,
                obj;
            
            for (key in curr) {
                if(curr.hasOwnProperty(key)) {
                   obj = curr[key];
                   if (typeof obj === 'string') {
                       delete curr[key];
                   }
                }
            }
            
            return curr
        }
        var par = stack.pop()
        if(component === 'VTODO'){
			par.vtodos.push(curr);
		}
        if(component === 'VEVENT'){
			par.vevents.push(curr);
		}

        return par
};

module.exports = ical;