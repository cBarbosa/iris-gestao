import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';
import { Utils } from 'src/app/shared/utils';
import { PastDateValidator } from '../../../shared/validators/custom-validators';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-rent-contract-edit',
	templateUrl: './rent-contract-edit.component.html',
	styleUrls: ['./rent-contract-edit.component.scss'],
})
export class RentContractEditComponent {
	editForm: FormGroup;

	contractGuid: string;
	isLoading = false;
	invalidGuid = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	dueDates: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	contractTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	renterTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	onInputDate: Function;
	onBlurDate: Function;

	selectedUnits: string[] = ['unidade1', 'unidade2', 'unidade3'];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private rentContractService: RentContractService
	) {}

	ngOnInit() {
		const contractGuid = this.activatedRoute.snapshot.paramMap.get('uid');

		// if (contractGuid === null) {
		// 	this.isLoading = false;
		// 	this.invalidGuid = true;
		// 	return;
		// }

		this.editForm = this.fb.group({
			contractInfo: this.fb.group({
				name: ['', Validators.required],
				contractType: [null, Validators.required],
				startDate: [null, [Validators.required]],
				endDate: [null, [Validators.required]],
				dueDate: [null, [Validators.required]],
				rentValue: ['', [Validators.required]],
			}),
			renterInfo: this.fb.group({
				renterName: ['', [Validators.required]],
				renterType: [null, [Validators.required]],
				cpfCnpj: ['', [Validators.required]],
				email: ['', [Validators.required]],
				telephone: ['', [Validators.required]],
			}),
			valueInfo: this.fb.group({
				netValue: ['', [Validators.required]],
				taxRetention: ['', [Validators.required]],
				discount: [null, [Validators.required]],
				readjust: [null, [Validators.required]],
				rentGrace: [null, [Validators.required]],
				gracePeriod: [null, [Validators.required]],
				creditTo: [null, [Validators.required]],
			}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.rentContractService
			.getContractByGuid(this.contractGuid)
			.subscribe((event) => {
				if (event) {
					const cep = event?.imovelEndereco[0]?.cep.toString() ?? '';
					const formatedCep = `${cep.slice(0, 2)}.${cep.slice(
						2,
						5
					)}-${cep.slice(5)}`;

					const data = event.data;

					this.editForm.controls['contractInfo'].patchValue({
						name: data.nome,
						contractType: null,
						startDate: null,
						endDate: null,
						dueDate: null,
						rentValue: 0,
					});
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
			});
	}

	get contractInfo() {
		return (this.editForm.controls['contractInfo'] as FormGroup).controls;
	}

	get renterInfo() {
		return (this.editForm.controls['renterInfo'] as FormGroup).controls;
	}

	get valueInfo() {
		return (this.editForm.controls['valueInfo'] as FormGroup).controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}
	onSubmit(e: Event) {}

	openModal() {
		this.displayModal = true;
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
