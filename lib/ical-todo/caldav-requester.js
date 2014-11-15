/**
 * Created by aab on 14.11.2014.
 */
"use strict";
var fs = require('../../test/test-helper/fs-test-helper');


var getIcsData = function(url){
     var result =  [];
    result.push(fs.readFileSync('./test/test-ics/79fe94ee-5524-46bd-b5e6-4fdec65c1f01-completed-once.ics')) ;
    return result;
};

module.exports = {
	getIcsData:getIcsData
}