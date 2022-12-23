import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { ImovelUnidade } from 'src/app/shared/models';
import { ImovelService } from 'src/app/shared/services';

import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-property-edit',
	templateUrl: './property-edit.component.html',
	styleUrls: ['./property-edit.component.scss'],
})
export class PropertyEditComponent implements OnInit {
	editForm: FormGroup;
	uid: string = '';
	isLoadingView: boolean = false;
	unit: ImovelUnidade;

	constructor(
		private fb: FormBuilder
		, private route: ActivatedRoute
		, private location: Location
		, private imovelService: ImovelService) {

		this.route.paramMap.subscribe(paramMap => {
			this.uid = paramMap.get('uid') ?? ''; 
		});

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

	};

	ngOnInit(): void {
		this.getData();
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

	getData() : void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getUnit(this.uid)
			?.pipe(first())
			.subscribe((unidade: ImovelUnidade) => {
				this.unit = unidade;
				this.isLoadingView = false;
			});
	}
}
