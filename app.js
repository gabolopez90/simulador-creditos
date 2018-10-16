var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var db = require("./data.js");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.post("/", urlencodedParser, (req,res,next)=>{
	var nac = req.body.nac;
	var ci = req.body.ci;

	if(ci.length<8){
		while(ci.length<8){
			ci = "0"+ci;
		}
	}	
	var cedula = nac + ci;	
	// var empleado = db.find(o => o.CEDULA == cedula);
	var empleado = db.find((o) =>{
		return o.CEDULA == cedula;
	});

	if(empleado === undefined){
		res.send("Cedula no encontrada");
	}
	else{
		res.send(empleado);	
	}
});
			

app.listen(8080);
console.log("listening on port "+ 8080);
