import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';

import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-property-edit',
	templateUrl: './property-edit.component.html',
	styleUrls: ['./property-edit.component.scss'],
})
export class PropertyEditComponent implements OnInit {
	editForm: FormGroup;

	constructor(private fb: FormBuilder, private location: Location) {}

	ngOnInit(): void {
		this.editForm = this.fb.group({
			name: ['', Validators.required],
			category: ['', [Validators.required]],
			type: ['', [Validators.required]],
			proprietary: ['', [Validators.required]],
			area_total: [''],
			area_usable: [''],
			area_occupancy: [''],
			occupancy: [''],
			iptu: [''],
			neoenergia: [''],
			caesb: [''],
			administration: [''],
			potential: [''],
		});
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
			// Object.keys(this.proposalForm.controls).forEach(key => {
			// 	this.proposalForm.get(key)?.markAsDirty()
			// })
			return;
		}
		console.log('form submitted');
	}

	goBack() {
		this.location.back();
	}
}
