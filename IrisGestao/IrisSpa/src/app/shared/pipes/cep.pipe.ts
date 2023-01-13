import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cep' })
export class CepPipe implements PipeTransform {
	transform(value: string): string {
		let valorFormatado = value + '';

		valorFormatado = valorFormatado.replace(/\D/g, '');
		if (valorFormatado.length > 8) valorFormatado = valorFormatado.slice(0, 8);

		valorFormatado =
			valorFormatado.slice(0, 2) +
			'.' +
			valorFormatado.slice(2, 5) +
			'-' +
			valorFormatado.slice(5);

		return valorFormatado;
	}
}
