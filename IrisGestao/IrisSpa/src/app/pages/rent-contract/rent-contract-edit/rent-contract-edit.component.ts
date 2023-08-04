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
import { DropdownItem } from 'src/app/shared/models/types';
import { CommonService, DominiosService } from 'src/app/shared/services';
import { first } from 'rxjs';
import { ContratoAluguel } from 'src/app/shared/models/contrato-aluguel.model';
import { Imovel } from 'src/app/shared/models';

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

	imovel: any;

	data: any;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	units: string[] = [];
	propertyGuid: string = '';

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
			label: 'Pessoa Física',
			value: 1,
		},
		{
			label: 'Pessoa Jurídica',
			value: 2,
		},
	];

	readjustmentIndex: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	creditTo: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	yesOrNo: DropdownItem[] = [
		{
			label: 'Sim',
			value: true,
		},
		{
			label: 'Não',
			value: false,
		},
	];

	isCpf: boolean = true;

	onInputDate: Function;
	onBlurDate: Function;

	selectedUnits: string[];
	selectedUnitsInvalid: boolean = false;

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private rentContractService: RentContractService,
		private commonService: CommonService,
		private dominiosService: DominiosService
	) {}

	ngOnInit() {
		const contractGuid = this.activatedRoute.snapshot.paramMap.get('guid');

		if (contractGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.contractGuid = contractGuid;

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
				discount: ['', [Validators.required]],
				readjust: [null, [Validators.required]],
				rentGrace: [null, [Validators.required]],
				gracePeriod: [
					'',
					[Validators.required, Validators.pattern(/\b(?:1[0-2]|[1-9])\b/)],
				],
				creditTo: [null, [Validators.required]],
			}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.dueDates = Array(31)
			.fill(null)
			.map((v, i) => ({
				label: i.toString(),
				value: i,
			}));

		this.rentContractService
			.getContractByGuid(this.contractGuid)
			.pipe(first())
			.subscribe((event) => {
				if (event) {
					/*					const cep = event?.imovelEndereco[0]?.cep.toString() ?? '';
					const formatedCep = `${cep.slice(0, 2)}.${cep.slice(
						2,
						5
					)}-${cep.slice(5)}`;
*/
					this.data = event.data;

					console.log('>>>', this.data);

					this.imovel = this.data.imovelAlugado[0];

					this.editForm.controls['contractInfo'].patchValue({
						name: this.data.numeroContrato,
						contractType: null,
						startDate: new Date(this.data.dataInicioContrato),
						endDate: new Date(this.data.dataFimContrato),
						dueDate: this.data.diaVencimentoAluguel,
						rentValue: this.data.valorAluguel,
					});

					const cliente = this.data.cliente;

					this.editForm.controls['renterInfo'].patchValue({
						renterName: cliente.nome,
						renterType: cliente.cpfCnpj.length > 11 ? 2 : 1,
						cpfCnpj: cliente.cpfCnpj,
						email: cliente.email,
						telephone: cliente.telefone,
					});

					this.isCpf = cliente.cpfCnpj.length <= 11;

					this.editForm.controls['valueInfo'].patchValue({
						netValue: this.data.valorAluguelLiquido,
						taxRetention: this.data.percentualRetencaoImpostos,
						discount: this.data.percentualDescontoAluguel,
						readjust: this.data.indiceReajuste.id,
						rentGrace: this.data.carenciaAluguel,
						gracePeriod: this.data.prazoCarencia,
						creditTo: this.data.creditoAluguel.id,
					});

					this.propertyGuid = this.data.imovelAlugado[0].guidReferencia;
					this.units = this.data.imovelAlugado[0].unidades.map(
						(p: any) => p.guidReferencia
					);
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
			});

		this.commonService
			.getReadjustment()
			.pipe(first())
			.subscribe({
				next: (event) => {
					if (event.success) {
						event.data.forEach(({ nome, id }: { nome: string; id: number }) => {
							this.readjustmentIndex.push({
								label: nome,
								value: id,
							});
						});

						if (this.data?.indiceReajuste.id)
							this.valueInfo['readjust'].setValue(
								+this.data?.indiceReajuste.id
							);
					}
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService
			.getTiposCreditoAluguel()
			.pipe(first())
			.subscribe({
				next: (event) => {
					if (event.success) {
						event.data.forEach(({ nome, id }: { nome: string; id: number }) => {
							this.creditTo.push({
								label: nome,
								value: id,
							});
						});

						if (this.data?.indiceReajuste.id)
							this.valueInfo['creditTo'].setValue(
								+this.data?.indiceReajuste.id
							);
					}
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService.getTiposContrato().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.contractTypes.push({
						label: item.nome,
						value: item.id,
					});
				});
			}
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

	setSelectedUnits(units: string[]) {
		console.log('esse >>>', units);

		this.selectedUnits = units;
	}

	setIsCpf() {
		const isCpf = this.renterInfo['renterType'].value === 1;
		this.isCpf = isCpf;
	}

	onHasGracePeriodChange() {
		const carencia = this.valueInfo['rentGrace'].value;

		if (carencia)
			this.valueInfo['gracePeriod'].setValidators([
				Validators.required,
				Validators.pattern(/\b(?:1[0-2]|[1-9])\b/),
			]);
		else this.valueInfo['gracePeriod'].setValidators(null);

		this.valueInfo['gracePeriod'].updateValueAndValidity();
	}

	onSubmit(e: Event) {
		if (this.editForm.invalid || this.selectedUnits?.length === 0) {
			this.editForm.markAllAsTouched();
			if (this.selectedUnits?.length === 0) {
				this.selectedUnitsInvalid = true;
			}
			return;
		}

		const formData: {
			contractInfo: {
				name: string;
				contractType: number;
				startDate: string;
				endDate: string;
				dueDate: string;
				rentValue: number;
			};
			renterInfo: {
				renterName: string;
				renterType: number;
				cpfCnpj: string;
				email: string;
				telephone: string;
			};
			valueInfo: {
				netValue: number;
				taxRetention: string;
				discount: string;
				prazoDesconto: number;
				readjust: number;
				rentGrace: boolean;
				gracePeriod: string;
				creditTo: number;
			};
		} = this.editForm.getRawValue();

		console.log('form data', formData);

		const contractObj: ContratoAluguel = {
			guidCliente: this.data.cliente.guidReferencia,
			idTipoCreditoAluguel: formData.valueInfo.creditTo,
			idIndiceReajuste: formData.valueInfo.readjust,
			idTipoContrato: formData.contractInfo.contractType,
			numeroContrato: formData.contractInfo.name,
			valorAluguel: formData.valueInfo.netValue,
			percentualRetencaoImpostos: +formData.valueInfo.taxRetention,
			percentualDescontoAluguel: +formData.valueInfo.discount,
			prazoDesconto: +formData.valueInfo.prazoDesconto,
			carenciaAluguel: formData.valueInfo.rentGrace,
			prazoCarencia: +formData.valueInfo.gracePeriod,
			dataInicioContrato: formData.contractInfo.startDate,
			prazoTotalContrato: this.data.prazoTotalContrato,
			dataOcupacao: this.data.dataOcupacao,
			diaVencimentoAluguel: +formData.contractInfo.dueDate,
			dataVencimentoPrimeraParcela: this.data.dataVencimentoPrimeraParcela,
			periodicidadeReajuste: this.data.periodicidadeReajuste,
			lstImoveis: [
				{
					guidImovel: this.propertyGuid,
					lstUnidades: this.selectedUnits,
				},
			],
		};

		console.debug('contractObj', contractObj);

		this.rentContractService
			.editContract(this.contractGuid, contractObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					console.log('response edit', response);
					if (response.success) {
						this.modalContent = {
							header: 'Edição realizada com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Edição não realizada',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Edição não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
				},
			});
	}

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
