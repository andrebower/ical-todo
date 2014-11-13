/**
 * Created by aab on 13.11.2014.
 */

var fs = require('fs');

var readFile = function(file){
    var data = fs.readFileSync(file,{encoding:'utf8'});
    data = data.replace(/\r\n|\n/g,'\r\n');
    return data;
};

module.exports = {
    readFileSync:readFile
};