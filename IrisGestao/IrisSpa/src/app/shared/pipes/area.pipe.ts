import { EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { MaskPipe, MaskApplierService } from 'ngx-mask';

@Pipe({ name: 'area' })
export class AreaPipe implements PipeTransform {
	transform(value: string | number, unit: string = 'm'): string {
		const ngxMaskPipe = new MaskPipe(
			new MaskApplierService({
				suffix: ' ' + unit + '²',
				prefix: '',
				thousandSeparator: ',',
				decimalMarker: ['.', ','],
				clearIfNotMatch: false,
				showTemplate: false,
				showMaskTyped: false,
				placeHolderCharacter: '',
				shownMaskExpression: '',
				dropSpecialCharacters: true,
				specialCharacters: [
					'-',
					'/',
					'(',
					')',
					'.',
					':',
					' ',
					'+',
					',',
					'@',
					'[',
					']',
					'"',
					"'",
				],
				hiddenInput: false,
				validation: false,
				separatorLimit: '',
				allowNegativeNumbers: false,
				leadZeroDateTime: false,
				triggerOnMaskChange: true,
				maskFilled: new EventEmitter(),
				patterns: {},
			})
		);

		let valorFormatado = ngxMaskPipe.transform(value + '', 'separator.2');

		valorFormatado = valorFormatado
			.replace('.', '-')
			.replaceAll(',', '.')
			.replace('-', ',');

		return valorFormatado;
	}
}
