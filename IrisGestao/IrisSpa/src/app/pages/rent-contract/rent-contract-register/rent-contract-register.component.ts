import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Utils } from 'src/app/shared/utils';

type Step = {
	label: string;
	isValid?: boolean;
	isCurrent?: boolean;
	isVisited?: boolean;
};

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-rent-contract-register',
	templateUrl: './rent-contract-register.component.html',
	styleUrls: ['./rent-contract-register.component.scss'],
})
export class RentContractRegisterComponent {
	registerForm: FormGroup;
	propertyAddForm: FormGroup;

	stepList: Step[];
	currentStep: number;

	onInputDate: Function;
	onBlurDate: Function;

	linkedContracts: {
		nome: string;
		tipo: string;
		numUnidade: number;
	}[] = [
		{
			nome: 'Ed. José Maria Lopes',
			tipo: 'Edifício Coorporativo',
			numUnidade: 308,
		},
	];
	propertyAddVisible = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	contractTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	renters: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	dueDates: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	discounts: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	discountDeadlines: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	readjustmentIndexes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	readjustmentPeriods: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	hasGracePeriod: DropdownItem[] = [
		{
			label: 'Sim',
			value: true,
		},
		{
			label: 'Não',
			value: false,
		},
	];

	gracePeriods: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	creditTo: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	buildingTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	buildings: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Valor teste',
			value: -1,
			disabled: false,
		},
	];

	units: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
		},
		{
			label: 'Valor teste',
			value: 0,
		},
	];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router
	) {}

	ngOnInit() {
		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Informações do Contrato',
				isCurrent: this.currentStep === 1,
				isVisited: false,
			},
			{
				label: 'Taxas e valores',
				isCurrent: this.currentStep === 2,
			},
			{
				label: 'Anexos',
				isCurrent: this.currentStep === 3,
			},
		];

		this.registerForm = this.fb.group({
			contractInfo: this.fb.group({
				nome: ['', Validators.required],
				tipo: [null, Validators.required],
				locatario: ['', Validators.required],
				dataInicio: [null, Validators.required],
				dataFim: [null, Validators.required],
				dataOcupacao: [null, Validators.required],
				dataVencimento: [null, Validators.required],
			}),
			valuesInfo: this.fb.group({
				valor: ['', Validators.required],
				valorLiquido: ['', Validators.required],
				retencao: ['', Validators.required],
				desconto: [null, Validators.required],
				descontoPrazo: [null, Validators.required],
				reajuste: [null, Validators.required],
				periodicidade: [null, Validators.required],
				carencia: [null, Validators.required],
				carenciaPrazo: [null, Validators.required],
				creditarPara: [null, Validators.required],
			}),

			attachmentsInfo: this.fb.group({
				attachment: [null],
			}),
		});

		this.propertyAddForm = this.fb.group({
			tipo: [null, Validators.required],
			edificio: ['', Validators.required],
			unidade: [null, Validators.required],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
	}

	get contractInfoForm() {
		return this.registerForm.controls['contractInfo'] as FormGroup;
	}

	get valuesInfoForm() {
		return this.registerForm.controls['valuesInfo'] as FormGroup;
	}

	get attachmentsForm() {
		return this.registerForm.controls['attachmentsInfo'] as FormGroup;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		if (this.currentStep === 1) return this.contractInfoForm.controls;
		if (this.currentStep === 2) return this.valuesInfoForm.controls;
		return this.attachmentsForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	changeStep(step: number) {
		this.stepList = this.stepList.map((entry: Step, i: number) => {
			const stepData: Step = {
				label: entry.label,
				isCurrent: undefined,
				isValid: undefined,
				isVisited: entry.isVisited,
			};

			const stepListIndex = i + 1;

			if (!entry.isVisited && stepListIndex === this.currentStep) {
				stepData.isVisited = true;
			}

			if (stepListIndex === 1) {
				stepData.isValid = this.contractInfoForm.valid ? true : false;
			} else if (stepListIndex === 2) {
				stepData.isValid = this.valuesInfoForm.valid ? true : false;
			} else if (stepListIndex === 3) {
				stepData.isValid = this.attachmentsForm.valid ? true : false;
			}

			if (step > stepListIndex) {
				if (stepListIndex === 2) {
				} else if (stepListIndex === 3) {
					stepData.isValid = this.attachmentsForm.valid ? true : false;
				}
			}

			if (step === stepListIndex) {
				stepData.isCurrent = true;
			}

			return stepData;
		});

		this.currentStep = step;
	}

	changeStepCb = (step: number) => {
		if (this.stepList[step - 1].isVisited || step < this.currentStep)
			this.changeStep(step);
	};

	nextStep() {
		const currStep = this.currentStep;
		if (currStep === 1) {
			if (this.contractInfoForm.invalid) {
				this.contractInfoForm.markAllAsTouched();
				return;
			}
		}
		if (currStep === 2) {
			if (this.valuesInfoForm.invalid) {
				this.valuesInfoForm.markAllAsTouched();
				return;
			}
		}
		if (currStep === 3) {
			this.onSubmit();
		}
		if (this.currentStep < this.stepList.length)
			this.changeStep(this.currentStep + 1);

		console.log('changing step');
	}

	prevStep() {
		if (this.currentStep > 1) this.changeStep(this.currentStep - 1);
		else this.goBack();
	}

	onUpload(e: any) {}

	onSubmit(e: any = null) {}

	onProprietarySubmit(e: any = null) {}

	addProperty: () => void = () => {};

	showAddProperty() {
		this.propertyAddVisible = true;
	}

	hideAddProperty = () => {
		this.propertyAddVisible = false;
	};

	openModal() {
		this.displayModal = true;
	}

	resetLinkedContracts() {
		this.linkedContracts = [];
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
