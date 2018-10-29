$("#ci-empleado").hide();
$("#nuevo-pago-min").hide();


// Selecciona nacionalidad
$("#ve").click(()=>{
	$("#dropdownMenuButton").text("V");
});

$("#ex").click(()=>{
	$("#dropdownMenuButton").text("E");
});


// Selecciona tipo de operacion
$("#credCliente").click(()=>{
	$("#tipoOperacion").text("Credinomina Cliente");
	$("#ci-empleado").hide();
});

$("#credEmpleado").click(()=>{
	$("#tipoOperacion").text("Credinomina Empleado");
	$("#ci-empleado").show();
});

$("#credPersonal").click(()=>{
	$("#tipoOperacion").text("Credipersonal");
	$("#ci-empleado").hide();
});

// Recalculo para simulador empleados

$("#sobregiro").click(()=>{
	$("#nuevo-pago-min").show();
});

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
		recalculado = (resto/pagoSolicitado)*solicitado;
	}
	
	if(recalculado <= 0){
		$("#recalculado").text("Bs. 0");
	}
	else if(recalculado > solicitado){		
		$("#recalculado").text("Bs. "+Math.floor(solicitado));
	}
	else{
		$("#recalculado").text("Bs. "+Math.floor(recalculado));
	}

});

// Calculo para simulador global



function pago(monto,plazo,interes){
	var x = monto * interes / (1 - (Math.pow(1/(1 + interes), plazo)));
	return Math.abs(x.toFixed(2));
}
