// Node packages for file system
var fs = require('fs');
var path = require('path');


var filePath = path.join(__dirname, 'data/CREDINOMINA_EMPLEADOS.txt');
// Read CSV
var f = fs.readFileSync(filePath, {encoding: 'utf-8'},
    function(err){console.log(err);});

// Split on row
f = f.split("\r\n");

// Get first row for column headers
headers = f.shift().split(";");

var json = [];
f.forEach(function(d){
    // Loop through each row
    tmp = {}
    row = d.split(";")
    for(var i = 0; i < headers.length; i++){
        tmp[headers[i]] = row[i];
    }
    // Add object to list
    json.push(tmp);
});

module.exports = json;
// var outPath = path.join(__dirname, 'PATH_TO_JSON');
// Convert object to string, write json to file
// fs.writeFileSync(outPath, JSON.stringify(json), 'utf8',
//     function(err){console.log(err);});
