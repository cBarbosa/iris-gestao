import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Utils } from 'src/app/shared/utils';

type Step = {
	label: string;
	isValid?: boolean;
	isCurrent?: boolean;
};

@Component({
	selector: 'app-property-register',
	templateUrl: './property-register.component.html',
	styleUrls: ['./property-register.component.scss'],
})
export class PropertyRegisterComponent {
	registerForm: FormGroup;

	unitTypes = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Edifício Corporativo',
			value: 'edificio_corporativo',
		},
		{
			label: 'Outro',
			value: 'outro',
		},
	];

	proprietaries = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Fulano de Tal',
			value: 'fulano',
		},
		{
			label: 'Cicrano outro',
			value: 'cicrano',
		},
	];

	stepList: Step[];
	currentStep: number;

	constructor(private fb: FormBuilder, private location: Location) {}

	ngOnInit() {
		this.registerForm = this.fb.group({
			propertyType: this.fb.group({
				name: ['', Validators.required],
				proprietary: [null, [Validators.required]],
				unitType: [null, [Validators.required]],
				area: ['', [Validators.required]],
			}),
			legalInfo: this.fb.group({
				registration: ['', [Validators.required]],
				iptu: ['', [Validators.required]],
				neoenergia: ['', [Validators.required]],
				caesb: ['', [Validators.required]],
				administration: ['', [Validators.required]],
				potential: ['', [Validators.required]],
			}),
			documents: this.fb.group({
				occupancy: ['', [Validators.required]],
				project: ['', [Validators.required]],
				registration: ['', [Validators.required]],
				others: ['', [Validators.required]],
			}),
		});

		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Tipo de imóvel',
				isValid: true,
			},
			{
				label: 'Informações legais',
				isCurrent: true,
			},
			{
				label: 'Documentos',
			},
		];

		this.changeStep(this.currentStep);
	}

	get propertyTypeForm() {
		return this.registerForm.controls['propertyType'] as FormGroup;
	}

	get legalInfoForm() {
		return this.registerForm.controls['legalInfo'] as FormGroup;
	}

	get documentsForm() {
		return this.registerForm.controls['documents'] as FormGroup;
	}

	changeStep(step: number) {
		this.currentStep = step;

		if (step === 2) this.propertyTypeForm.markAllAsTouched();
		if (step === 3) this.legalInfoForm.markAllAsTouched();

		this.stepList = this.stepList.map((entry: Step, i: number) => {
			const stepData: Step = {
				label: entry.label,
			};
			if (step > i + 1)
				stepData.isValid = this.propertyTypeForm.valid ? true : false;

			if (step === i + 1) stepData.isCurrent = true;

			return stepData;
		});
	}

	changeStepCb() {
		const stepList = this.stepList;
		const setStepList = (list: Step[], currStep: number) => {
			this.stepList = list;
			this.changeStep(currStep);
		};

		return (step: number) => {
			setStepList(
				stepList.map((entry: Step, i: number) => {
					if (step > i + 1)
						return {
							label: entry.label,
							isValid: true,
						};

					if (step === i + 1) {
						return {
							label: entry.label,
							isCurrent: true,
						};
					}

					return {
						label: entry.label,
					};
				}),
				step
			);
		};
	}

	nextStep() {
		const currStep = this.currentStep;
		if (currStep === 1 && this.propertyTypeForm.invalid) {
			this.propertyTypeForm.markAllAsTouched();
			return;
		}
		if (currStep === 2 && this.legalInfoForm.invalid) {
			this.legalInfoForm.markAllAsTouched();
			return;
		}
		if (currStep === 3) {
			this.onSubmit();
		}
		if (this.currentStep < this.stepList.length)
			this.changeStep(this.currentStep + 1);
	}

	prevStep() {
		if (this.currentStep > 1) this.changeStep(this.currentStep - 1);
		else this.goBack();
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		if (this.currentStep === 1) return this.propertyTypeForm.controls;
		if (this.currentStep === 2) return this.legalInfoForm.controls;
		return this.registerForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onUpload(e: any) {}

	onSubmit(e: any = null) {
		console.log('submitting form');

		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}
		console.log('form submitted');
	}

	goBack() {
		this.location.back();
	}
}
