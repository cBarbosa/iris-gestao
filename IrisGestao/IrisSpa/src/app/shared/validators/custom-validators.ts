import {
	AbstractControl,
	FormControl,
	ValidationErrors,
	Validators,
} from '@angular/forms';

export function EmailValidator(control: FormControl) {
	// tslint:disable-next-line:max-line-length
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(control.value)) {
		return { 'E-mail inválido': true };
	}

	return null;
}

export function CpfValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = String(control.value);
	const cpf = value.replace(/[^0-9]*/g, '');
	if (cpf) {
		if (cpf.length < 11) {
			return { cpfNotValid: true };
		}

		let numbers;
		let digits;
		let sum;
		let i;
		let result;
		let equalDigits;
		equalDigits = 1;

		if (
			cpf === '00000000000' ||
			cpf === '11111111111' ||
			cpf === '22222222222' ||
			cpf === '33333333333' ||
			cpf === '44444444444' ||
			cpf === '55555555555' ||
			cpf === '66666666666' ||
			cpf === '77777777777' ||
			cpf === '88888888888' ||
			cpf === '99999999999'
		) {
			return { cpfNotValid: true };
		}

		for (i = 0; i < cpf.length - 1; i++) {
			if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
				equalDigits = 0;
				break;
			}
		}

		if (!equalDigits) {
			numbers = cpf.substring(0, 9);
			digits = cpf.substring(9);
			sum = 0;
			for (i = 10; i > 1; i--) {
				sum += parseInt(numbers.charAt(10 - i)) * i;
			}

			result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

			if (result !== Number(digits.charAt(0))) {
				return { cpfNotValid: true };
			}
			numbers = cpf.substring(0, 10);
			sum = 0;

			for (i = 11; i > 1; i--) {
				sum += parseInt(numbers.charAt(11 - i)) * i;
			}
			result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

			if (result !== Number(digits.charAt(1))) {
				return { cpfNotValid: true };
			}
			return null;
		} else {
			return { cpfNotValid: true };
		}
	}
	return null;
}

export function CnpjValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = String(control.value);
	const cnpj = value.replace(/[^0-9]*/g, '');

	if (cnpj == '') return { isCnpj: true };

	if (cnpj.length != 14) return { isCnpj: true };

	// Elimina CNPJs invalidos conhecidos
	if (
		cnpj == '00000000000000' ||
		cnpj == '11111111111111' ||
		cnpj == '22222222222222' ||
		cnpj == '33333333333333' ||
		cnpj == '44444444444444' ||
		cnpj == '55555555555555' ||
		cnpj == '66666666666666' ||
		cnpj == '77777777777777' ||
		cnpj == '88888888888888' ||
		cnpj == '99999999999999'
	)
		return { isCnpj: true };

	// Valida DVs
	let tamanho = cnpj.length - 2;
	let numeros = cnpj.substring(0, tamanho);
	let digitos = cnpj.substring(tamanho);
	let soma = 0;
	let pos = tamanho - 7;
	let i;
	for (i = tamanho; i >= 1; i--) {
		soma += Number(numeros.charAt(tamanho - i)) * pos--;
		if (pos < 2) pos = 9;
	}
	let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado != Number(digitos.charAt(0))) return { isCnpj: true };

	tamanho = tamanho + 1;
	numeros = cnpj.substring(0, tamanho);
	soma = 0;
	pos = tamanho - 7;
	for (i = tamanho; i >= 1; i--) {
		soma += Number(numeros.charAt(tamanho - i)) * pos--;
		if (pos < 2) pos = 9;
	}
	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado != Number(digitos.charAt(1))) return { isCnpj: true };

	return null;
}

export function CpfCnpjValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = String(control.value);
	const formatedValue = value.replace(/[^0-9]*/g, '');

	if (formatedValue.length > 11) return CnpjValidator(control);

	return CpfValidator(control);
}

export function PastDateValidator(control: AbstractControl) {
	let checkingDate;

	if (control.value instanceof Date) {
		checkingDate = control.value;
	} else {
		let msDate = Date.parse(control.value);
		if (isNaN(msDate)) {
			return { pastDateValidator: true };
		}
		checkingDate = new Date(msDate);
	}

	if (typeof checkingDate.getTime() === 'number') {
		const today = new Date();
		console.log(today, ' -> ', checkingDate);

		if (today.getTime() - checkingDate.getTime() >= 0) {
			return null;
		}
	}

	return { pastDateValidator: true };
}
