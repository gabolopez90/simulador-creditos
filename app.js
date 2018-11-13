//Declara los modulos utilizados
//Express para manejar las conexiones, body-parser para manejar la data ingresada por el usuario y ejs para la presentacion
//OS obtiene información del equipo del usuario
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var db = require("./data.js");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var os = require('os');
var fs = require("fs");

//Obtiene nm del usuario
var user = os.userInfo().username;

//Usa express para servir el contenido estatico. Define a ejs como el programa para la visualizacion
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd')); // redirect JS popper
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css')); // redirect CSS font-awesome
app.use('/fonts', express.static('./node_modules/font-awesome/fonts')) // redirect CSS font-awesome

app.get("/simulador_empleado", (req,res,next)=>{
	res.render("simulador_empleado");
});

app.get("/simulador_global", (req,res,next)=>{
	res.render("simulador_global");
});

//Recibe y procesa los datos ingresados por el usuario
app.post("/empleado", urlencodedParser, (req,res,next)=>{
	var nac = req.body.nac;
	var ci = req.body.ci;
	var solicitado = req.body.solicitado;

	//Si la cedula tiene menos de 8 digitos rellena con 0 a la izquierda, para el alfanumerico 9
	if(ci.length<8){
		while(ci.length<8){
			ci = "0"+ci;
		}
	}

	//Une la nacionalidad con la cedula creando una variable alfanumerica 9 para la comparacion
	var cedula = nac + ci;
	//Busca la cedula ingresada en la base de datos
	var empleado = db.find((o) =>{
		return o.CEDULA == cedula;
	});

		// Si no es empleado, devuelve una pagina de error, si es empleado muestra la informacion
	if(empleado === undefined){
		res.render("no_encontrado", {data: cedula});
	}
	else{		
		empleado.MONTO_SOLICITADO = solicitado;
		if(empleado.NEGADO_DETALLE === "" && empleado.APROBADO_DEF_FINAL !== "0,00"){			
			res.render("empleado", {data: empleado});
		}
		else{			
			res.render("negado",{data: empleado});
		}
	}
});

app.post("/save", urlencodedParser, (req,res,next)=>{
	var ci = req.body.ci;
	var nombre = req.body.nombre;
	var def = req.body.aprobado_def;
	var solicitado = req.body.monto_solicitado;
	var fecha = req.body.fecha;
	var decision = req.body.decision;
	var observacion = req.body.observacion;
	var stream = fs.createWriteStream("data/evaluados.txt", {flags:'a'});
	stream.write(nombre + ";" + solicitado + ";"+ def + ";" + fecha + ";" + decision + ";" + observacion + ";" + user + "\r\n");
	stream.end();
});



//Inicia el servidor en el puerto 8080
app.listen(8080);
console.log("listening on port "+ 8080);
