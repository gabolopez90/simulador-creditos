// Oculta elementos al cargar pagina
$("#ci-empleado").hide();
$("#nuevo-pago-min").hide();
$("#nuevo-pago-min-manual").hide();
$("#forma-credinomina").hide();
$("#forma-credinomina-empleado").hide();
$("#forma-credipersonal").hide();
$("#calcular").hide();

// Simulador empleados

// El monto aprobado no puede ser mayor al solicitado
var checkSol = parseInt($("#solicitado").text().replace(".",""));
var checkApr = parseInt($("#monto_aprobado_empleado").text().replace(".",""));
if(checkApr > checkSol){
	$("#monto_aprobado_empleado").text(checkSol);
}

// Selecciona nacionalidad
$("#ve").click(()=>{
	$("#dropdownMenuButton").text("V");
});

$("#ex").click(()=>{
	$("#dropdownMenuButton").text("E");
});

// Recalculo para simulador empleados
$("#sobregiro").click(()=>{
	$("#nuevo-pago-min-manual").hide();
	$("#nuevo-pago-min").show();
});

$("#pago_min_manual").click(()=>{
	$("#nuevo-pago-min").hide();
	$("#nuevo-pago-min-manual").show();
});

// Recalculo eliminando el sobregiro de la TDC
$("#recalcular").click(()=>{
	// Obtener los datos del empleado
	var sobregiro = parseInt($("#monto-sobregiro").val());
	var pagoMinViejo = parseInt($("#pago-min-viejo").text().replace(".",""));
	var salario = parseInt($("#salario").text().replace(".",""));
	var endeudamiento = parseInt($("#endeudamiento").text().replace("%",""));
	var tasa = parseInt($("#tasa").text().replace("%",""))/100;
	var solicitado = parseInt($("#solicitado").text());
	var saldoCredinomina = parseInt($("#saldo_credinomina").text().replace(".",""));
	// Calculos de variables
	var nuevoPagoMin = pagoMinViejo - sobregiro;
	var ajustado = (0.80 - (nuevoPagoMin/salario));
	var resto = Math.floor(ajustado * salario);	
	var pagoSolicitado = pago(solicitado,60,tasa/12);
	var max = salario * 8;
	var disponible = max - saldoCredinomina;

	var recalculado = 0;
	if((resto/pagoSolicitado)*solicitado >= disponible){
		recalculado = disponible;
	} else {
		recalculado = round5((resto/pagoSolicitado)*solicitado);
	}	

	if(recalculado <= 0){
		$("#recalculado").text("Bs. 0");
	}
	else if(recalculado > checkApr){
		$("#recalculado").text("Bs. "+checkApr);
	}
	else if(recalculado > solicitado){		
		$("#recalculado").text("Bs. "+solicitado);
	}
	else{
		$("#recalculado").text("Bs. "+recalculado);
	}

});

// Recalculo con pago minimo ingresado manualmente
$("#recalcular-pago-min").click(()=>{
	// Obtener los datos del empleado
	var nuevoPagoMinManual = parseInt($("#monto-pago-min-manual").val());
	var pagoMinSinTdc = parseInt($("#pago-min-sin-tdc").text().replace(".",""));	
	var salario = parseInt($("#salario").text().replace(".",""));
	var endeudamiento = parseInt($("#endeudamiento").text().replace("%",""));
	var tasa = parseInt($("#tasa").text().replace("%",""))/100;
	var solicitado = parseInt($("#solicitado").text());
	var saldoCredinomina = parseInt($("#saldo_credinomina").text().replace(".",""));
	// Calculos de variables	
	var nuevoPagoMin = nuevoPagoMinManual + pagoMinSinTdc;
	var ajustado = (0.80 - (nuevoPagoMin/salario));
	var resto = Math.floor(ajustado * salario);	
	var pagoSolicitado = pago(solicitado,60,tasa/12);
	var max = salario * 8;
	var disponible = max - saldoCredinomina;

	var recalculado = 0;
	if((resto/pagoSolicitado)*solicitado >= disponible){
		recalculado = disponible;
	} else {
		recalculado = round5((resto/pagoSolicitado)*solicitado);
	}
	
	if(recalculado <= 0){
		$("#recalculado-pago-min").text("Bs. 0");
	}
	else if(recalculado > checkApr){
		$("#recalculado-pago-min").text("Bs. "+checkApr);
	}
	else if(recalculado > solicitado){		
		$("#recalculado-pago-min").text("Bs. "+solicitado);
	}
	else{
		$("#recalculado-pago-min").text("Bs. "+recalculado);
	}

});


// Simulador global

// Selecciona tipo de operacion
$("#credCliente").click(()=>{
	$("#tipoOperacion").text("Credinomina Cliente");
	$("#forma-credinomina").fadeIn("slow");
	$("#calcular").fadeIn("slow");
	$("#forma-credipersonal").hide();
	$("#plazo_solicitado").attr("value","12");
	$("#endeudamiento_max").attr("value","35");
	$("#selTasa").text("24");
});

$("#credEmpleado").click(()=>{
	$("#tipoOperacion").text("Credinomina Empleado");
	$("#forma-credinomina").fadeIn("slow");
	$("#calcular").fadeIn("slow");
	$("#forma-credipersonal").hide();
	$("#plazo_solicitado").attr("value","60");
	$("#endeudamiento_max").attr("value","80");
	$("#selTasa").text("12");
});

$("#credPersonal").click(()=>{
	$("#tipoOperacion").text("Credipersonal");
	$("#forma-credipersonal").fadeIn("slow");
	$("#forma-credinomina").hide();
	$("#calcular").hide();
});

// Selecciones tasa de interes anual
$("#tasa24").click(()=>{
	$("#selTasa").text("24");
});

$("#tasa14").click(()=>{
	$("#selTasa").text("14");
});

$("#tasa12").click(()=>{
	$("#selTasa").text("12");
});

// Calculos de credinomina, tomando en cuenta los datos ingresados por el usuario
$("#calcular").click(()=>{
	// Recibe la informacion de la forma
	var simSolicitado = parseInt($("#monto_solicitado").val());
	var simPlazoSolicitado = parseInt($("#plazo_solicitado").val());
	var simInteres = parseInt($("#selTasa").text())/100;
	var simEndeudamiento = parseInt($("#endeudamiento_max").val());
	var simIngresos = parseInt($("#ingresos_cliente").val());
	var simCargas = parseInt($("#cargas_financieras").val());	
	var simAjustado = (simEndeudamiento/100 - (simCargas/simIngresos));
	var simResto = Math.floor(simAjustado * simIngresos);
	var simPagoSolicitado = pago(simSolicitado,simPlazoSolicitado,simInteres/12);
	var simMax = simIngresos * 8;
	
	// Calcula monto aprobado para que no sobrepase monto solicitado ni disponible
	if((simResto/simPagoSolicitado)*simSolicitado >= simMax){
		montoAprobado = simMax;
	} else {
		montoAprobado = (simResto/simPagoSolicitado)*simSolicitado;
	}
	
	if(montoAprobado <= 0){
		$(".modal-body p").hide();		
		$("#credinomina_simulado").html("Cliente no aprueba para un credinómina con los datos ingresados.");
	}
	else {
		$(".modal-body p").show();
		$("#plazo_final").text(simPlazoSolicitado);
		$("#interes_final").text(Math.floor(simInteres * 100));
		$("#credinomina_simulado").html("Aprobado por <span class='badge badge-success'>Bs. " + round5(montoAprobado) + "</span> a " + simPlazoSolicitado + " meses.");
	}	
	$('#presentacion').modal('show');

});

// Funcion con formula de pago para un credito a plazo fijo
function pago(monto,plazo,interes){
	var x = monto * interes / (1 - (Math.pow(1/(1 + interes), plazo)));
	return Math.abs(x.toFixed(2));
}

// Funcion para redondear al multiplo de 5 superior
function round5(x)
{
    return Math.ceil(x/5)*5;
}
