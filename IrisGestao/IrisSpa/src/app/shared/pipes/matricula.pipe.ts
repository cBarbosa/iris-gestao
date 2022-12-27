import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'matricula' })
export class MatriculaPipe implements PipeTransform {
	transform(value: string): string {
		let valorFormatado = value + '';

		valorFormatado = valorFormatado.replace(/\D/g, '');
		if (valorFormatado.length > 16)
			valorFormatado = valorFormatado.slice(0, 16);

		if (valorFormatado.length > 9 && valorFormatado.length <= 13)
			valorFormatado =
				valorFormatado.slice(0, 9) + '.' + valorFormatado.slice(9);
		else if (valorFormatado.length > 13)
			valorFormatado =
				valorFormatado.slice(0, 9) +
				'.' +
				valorFormatado.slice(9, 13) +
				'/' +
				valorFormatado.slice(13);

		return valorFormatado;
	}
}
