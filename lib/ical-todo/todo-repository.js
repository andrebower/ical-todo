/**
 * Created by aab on 13.11.2014.
 */
"use strict";
var map = {};

module.exports = {
	
    set:function(k,v){
    	map[k] = v;
    },
    get:function(k){
    	return map[k];
    }


};