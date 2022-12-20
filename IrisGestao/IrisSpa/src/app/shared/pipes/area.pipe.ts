import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'area' })
export class AreaPipe implements PipeTransform {
	transform(value: string | number, unit: string = 'm'): string {
		let valorFormatado = value + '';

		valorFormatado = valorFormatado.replace(/\D/g, '');

		valorFormatado = valorFormatado + ' ' + unit + '²';
		return valorFormatado;
	}
}
