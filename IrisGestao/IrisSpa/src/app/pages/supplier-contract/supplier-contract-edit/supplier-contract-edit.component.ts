import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { DropdownItem } from 'src/app/shared/models/types';
import {
	ClienteService,
	CommonService,
	DominiosService,
} from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { SupplierContractService } from 'src/app/shared/services/supplier-contract.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-supplier-contract-edit',
	templateUrl: './supplier-contract-edit.component.html',
	styleUrls: ['./supplier-contract-edit.component.scss'],
})
export class SupplierContractEditComponent {
	editForm: FormGroup;

	contractGuid: string;
	isLoading = true;
	isSubmitting = false;
	invalidGuid = false;

	data: any;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	isMobile: boolean = false;

	units: string[] = [];
	propertyGuid: string = '';

	dueDates: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	supplierNames: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	readjustmentIndex: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	onInputDate: Function;
	onBlurDate: Function;

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private responsiveService: ResponsiveService,
		private commonService: CommonService,
		private clienteService: ClienteService,
		private activatedRoute: ActivatedRoute,
		private supplierContractService: SupplierContractService,
		private supplierService: SupplierService
	) {}

	ngOnInit() {
		const contractGuid = this.activatedRoute.snapshot.paramMap.get('guid');

		if (contractGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.contractGuid = contractGuid;

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.editForm = this.fb.group({
			contractNumber: [null, Validators.required],
			descricaoServico: [null, Validators.required],
			supplierName: [null, Validators.required],
			cnpj: [{ value: null, disabled: true }, Validators.required],
			serviceValue: ['', Validators.required],
			startDate: [null, [Validators.required]],
			endDate: [null, [Validators.required]],
			dataVencimentoPrimeraParcela: [null, [Validators.required]],
			contractIndex: [null, Validators.required],
			periodicidade: ['', [Validators.required]],
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

		this.supplierContractService
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
					this.data = event.data[0];

					console.log('>>>', this.data);

					this.editForm.patchValue({
						contractNumber: this.data.numeroContrato,
						descricaoServico: this.data.descricaoServico,
						supplierName: this.data.fornecedor.guidReferencia,
						cnpj: this.data.fornecedor.cpfCnpj, //??
						serviceValue: this.data.valorServicoContratado,
						startDate: new Date(this.data.dataInicioContrato),
						endDate: new Date(this.data.dataFimContrato),
						dataVencimentoPrimeraParcela: new Date(this.data.dataVencimentoPrimeraParcela),
						contractIndex: this.data.indiceReajuste.id,
						periodicidade: this.data.periodicidadeReajuste, //??
					});

					this.propertyGuid = this.data.imovel.guidReferencia;
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
							this.contractInfo['contractIndex'].setValue(
								+this.data?.indiceReajuste.id
							);
					}
				},
				error: (err) => {
					console.error(err);
				},
			});

		// this.clienteService
		// 	.getListaProprietarios()
		// 	.pipe(first())
		// 	.subscribe({
		// 		next: (event) => {
		// 			if (event.success) {
		// 				event.data.forEach(
		// 					({
		// 						nome,
		// 						guidReferencia,
		// 					}: {
		// 						nome: string;
		// 						guidReferencia: number;
		// 					}) => {
		// 						this.supplierNames.push({
		// 							label: nome,
		// 							value: guidReferencia,
		// 						});
		// 					}
		// 				);

		// 				if (data?.fornecedor.guidReferencia)
		// 					this.contractInfo['supplierName'].setValue(
		// 						data.fornecedor.guidReferencia
		// 					);
		// 			}
		// 		},
		// 		error: (err) => {
		// 			console.error(err);
		// 		},
		// 	});

		this.supplierService
			.getSuppliers(100)
			.pipe(first())
			.subscribe((event) => {
				if (event) {
					// this.supplierNames = [
					// 	{
					// 		label: 'Selecione',
					// 		value: null,
					// 		disabled: true,
					// 	},
					// ];
					event.data.items.forEach((item: any) => {
						this.supplierNames.push({
							label: item.nome,
							value: item.guidReferencia,
						});
					});

					if (this.data?.fornecedor.guidReferencia)
						this.contractInfo['supplierName'].setValue(
							this.data.fornecedor.guidReferencia
						);
				}
			});
	}

	get contractInfo() {
		return this.editForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: Event) {
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		this.isSubmitting = true;
		/*
			contractNumber: [null, Validators.required],
			supplierName: [null, Validators.required],
			supplierType: [{ value: null, disabled: true }, Validators.required],
			cnpj: [{ value: null, disabled: true }, Validators.required],
			serviceValue: ['', Validators.required],
			startDate: [null, [Validators.required]],
			endDate: [null, [Validators.required]],
			dueDate: [null, [Validators.required]],
			contractIndex: [null, Validators.required],
			periodicidade: ['', [Validators.required]],
		*/

		const formData: {
			contractNumber: string;
			descricaoServico: string;
			supplierName: string;
			cnpj: string;
			serviceValue: string;
			startDate: string;
			endDate: string;
			dataVencimentoPrimeraParcela: string;
			contractIndex: number;
			periodicidade: string;
		} = this.editForm.getRawValue();

		console.log('form data', formData);

		const contractObj = {
			guidImovel: this.propertyGuid,
			guidFornecedor: formData.supplierName,
			descricaoDoServico: formData.descricaoServico,
			idFormaPagamento: this.data.formaPagamento.id,
			idIndiceReajuste: formData.contractIndex,
			numeroContrato: formData.contractNumber,
			descricaoServico: formData.descricaoServico,
			percentual: this.data.percentual,
			dataAtualizacao: this.data.dataAtualizacao,
			valorServicoContratado: +formData.serviceValue,
			dataInicioContrato: formData.startDate,
			dataFimContrato: formData.endDate,
			dataVencimentoPrimeraParcela: formData.dataVencimentoPrimeraParcela,
			periodicidadeReajuste: +formData.periodicidade,
		};

		console.debug('contractObj', contractObj);

		this.supplierContractService
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
					this.isSubmitting = false;
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Edição não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
					this.isSubmitting = false;
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
