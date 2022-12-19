import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-client-edit',
	templateUrl: './client-register.component.html',
	styleUrls: ['./client-register.component.scss'],
})
export class ClientRegisterComponent {
	editForm: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	clientTypes = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Pessoa física',
			value: 'fisica',
		},
		{
			label: 'Pessoa jurídica',
			value: 'juridica',
		},
	];

	constructor(private fb: FormBuilder, private location: Location) {}

	ngOnInit() {
		this.editForm = this.fb.group({
			name: ['', Validators.required],
			birthday: [null, [Validators.required]],
			clientType: [null, [Validators.required]],
			cpf: ['', [Validators.required]],
			email: ['', [Validators.required]],
			telephone: ['', [Validators.required]],
			cep: ['', [Validators.required]],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: any = null) {
		console.log('submitting form');

		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}
		console.log('form submitted');
	}

	goBack() {
		this.location.back();
	}
}
