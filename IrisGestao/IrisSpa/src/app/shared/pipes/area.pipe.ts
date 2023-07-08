import { EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { MaskPipe, MaskApplierService } from 'ngx-mask';

@Pipe({ name: 'area' })
export class AreaPipe implements PipeTransform {
	transform(value: string | number | undefined, unit: string = 'm'): string {
		if (value === undefined) return '';

		const ngxMaskPipe = new MaskPipe(
			new MaskApplierService({
				suffix: ' ' + unit + '²',
				prefix: '',
				thousandSeparator: ',',
				decimalMarker: ['.', ','],
				// leadZero: true,
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
				leadZeroDateTime: true,
				triggerOnMaskChange: true,
				maskFilled: new EventEmitter(),
				patterns: {},
			})
		);

		let valueStr = value + '';

		if (valueStr.at(-2) === '.') valueStr = valueStr + '0';
		else if (valueStr.at(-1) === '.') valueStr = valueStr + '00';
		else valueStr = valueStr + '.00';

		let valorFormatado = ngxMaskPipe.transform(valueStr + '', 'separator.2');

		valorFormatado = valorFormatado
			.replace('.', '-')
			.replaceAll(',', '.')
			.replace('-', ',');

		return valorFormatado;
	}
}
