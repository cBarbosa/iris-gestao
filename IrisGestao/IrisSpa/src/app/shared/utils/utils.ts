import { AbstractControl } from '@angular/forms';

export class Utils {
	static checkHasError(control: AbstractControl<any, any>) {
		return control?.invalid && (control.dirty || control.touched);
	}

	static debounce(func: Function, wait: number = 500): Function {
		let timer: number | null = null;
		return function (...args: any) {
			timer !== null && clearTimeout(timer);
			timer = window.setTimeout((): any => func(...args), wait);
		};
	}

	static calendarMaskHandlers(): any {
		// TO MASK CALENDAR INPUT
		let calendarDateMask: string;
		let calendarDate: Date | null;

		function onInputDate(event: any): void {
			console.log('event', event);
			let cursorPosition = event.target.selectionEnd;

			if (
				event.inputType === 'deleteContentBackward' &&
				(cursorPosition === 2 || cursorPosition === 5)
			) {
				event.target.value =
					event.target.value.substring(0, cursorPosition - 1) +
					event.target.value.substring(cursorPosition);
				cursorPosition--;
			}
			if (event.inputType === 'insertText' && event.target.value.length > 10) {
				event.target.value = event.target.value.substring(
					0,
					event.target.value.length - 1
				);
			}

			calendarDateMask = event.target.value.toString();
			calendarDateMask = calendarDateMask.replace(/\D/g, '');

			let mask = '';
			for (let i = 0; i < calendarDateMask.length; i++) {
				mask += calendarDateMask[i];
				if (i === 1 || i === 3) {
					mask += '/';
					if (cursorPosition === 2 || cursorPosition === 5) {
						cursorPosition++;
					}
				}
			}
			event.target.value = mask.toString();
			event.target.selectionStart = cursorPosition;
			event.target.selectionEnd = cursorPosition;

			if (event.target.value.length === 10) {
				const dt = stringToDate(event.target.value);
				if (isValidDate(dt)) {
					calendarDate = dt;
				}
			}
		}

		function onBlurDate(): void {
			if (!!calendarDate && !isValidDate(calendarDate)) {
				calendarDate = null;
			}
		}
		function stringToDate(str: string) {
			return new Date(str);
		}
		function isValidDate(date: Date) {
			return date instanceof Date;
		}
		// END MASK CALENDAR

		return { onInputDate, onBlurDate };
	}
}
