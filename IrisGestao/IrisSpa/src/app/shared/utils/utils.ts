import { AbstractControl } from '@angular/forms';

export class Utils {
	static checkHasError(control: AbstractControl<any, any>) {
		return control?.invalid && (control.dirty || control.touched);
	}
}
