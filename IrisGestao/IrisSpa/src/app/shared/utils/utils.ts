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

	static humanFileSize(size: number) {
		const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
		return (
			(size / Math.pow(1024, i)).toFixed(2) +
			' ' +
			['B', 'kB', 'MB', 'GB', 'TB'][i]
		);
	}

	static async dataUrlToFile(
		dataUrl: string | ArrayBuffer,
		fileName: string,
		mimeType: string
	): Promise<File> {
		if (dataUrl instanceof ArrayBuffer) {
			dataUrl = this.arrayBufferToBase64(dataUrl);
		}
		const res: Response = await fetch(dataUrl);
		const blob: Blob = await res.blob();
		return new File([blob], fileName, { type: mimeType });
	}

	static async fileToDataUrl(file: File): Promise<{
		name: string;
		mimetype: string;
		data: string | ArrayBuffer | null;
	}> {
		return new Promise((res, rej) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = () =>
				res({ name: file.name, mimetype: file.type, data: reader.result });
			reader.onerror = (error) => rej(error);
		});
	}

	static saveAs(uri: string | ArrayBuffer, filename: string) {
		if (uri instanceof ArrayBuffer) {
			uri = this.arrayBufferToBase64(uri);
		}

		const linkNode = document.createElement('a');
		if (typeof linkNode.download === 'string') {
			document.body.appendChild(linkNode); // Firefox requires the linkNode to be in the body
			linkNode.download = filename;
			linkNode.href = uri;
			linkNode.click();
			document.body.removeChild(linkNode); // remove the linkNode when done
		} else {
			location.replace(uri);
		}
	}

	static arrayBufferToBase64(buffer: ArrayBuffer) {
		var binary = '';
		var bytes = new Uint8Array(buffer);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
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
