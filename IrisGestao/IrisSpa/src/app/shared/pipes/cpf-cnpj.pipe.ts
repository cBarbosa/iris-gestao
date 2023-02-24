import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpfcnpj' })
export class CpfCnpjPipe implements PipeTransform {
	transform(value: string | number): string {
		let valorFormatado = value + '';

		valorFormatado = valorFormatado.replace(/[^0-9]/, ''); // item 3

		if (valorFormatado.length <= 11) {
			valorFormatado = valorFormatado
				.padStart(11, '0')
				.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

			return valorFormatado;
		} else if (valorFormatado.length <= 14) {
			valorFormatado = valorFormatado
				.padStart(14, '0')
				.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

			return valorFormatado;
		}

		return value.toString();
	}
}
