const convertePlaca = function(placa) {
	let regex1 = /^\w{3}-\d{4}/;
	let regex2 = /^\w{3}\d{4}/;
	if(!regex1.test(placa) && !regex2.test(placa)) {
		return 'erro';
	}
	else {
		if(placa.contains('-')) {
			return placa.toUpperCase();
		}
		else {
			let letras  = placa.substring(0, 3);
			let numeros = placa.substring(3);
			let placaOK = letras + "-" + numeros;
			return placaOK.toUpperCase(); 
		}
	}
}

module.exports = convertePlaca;