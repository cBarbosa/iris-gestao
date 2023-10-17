import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import {
	ActivatedRoute,
	Router
} from '@angular/router';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';
import { Utils } from 'src/app/shared/utils';
import { DropdownItem } from 'src/app/shared/models/types';
import {
	CommonService,
	DominiosService,
	ClienteService
} from 'src/app/shared/services';
import { first, firstValueFrom } from 'rxjs';
import { ContratoAluguel } from 'src/app/shared/models/contrato-aluguel.model';

@Component({
	selector: 'app-rent-contract-edit',
	templateUrl: './rent-contract-edit.component.html',
	styleUrls: ['./rent-contract-edit.component.scss'],
})
export class RentContractEditComponent {
	editForm: FormGroup;

	contractGuid: string;
	isLoading = true;
	invalidGuid = false;

	imovel: any;
	unidade: Array<any> = [];
	tipoUnidade: string = 'Não informado';
	imoveisCadastrados: Array<any> = [];

	data: any;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	units: Array<string> = [];
	propertyGuid: string = '';

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

	renters: DropdownItem[] = [
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
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
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
				dataOcupacao: [null, [Validators.required]],
			}),
			renterInfo: this.fb.group({
				locatario: [null, Validators.required],
			}),
			valueInfo: this.fb.group({
				rentValue: ['', [Validators.required]],
				taxRetention: ['', [Validators.required]],
				discount: ['', [Validators.required]],
				readjust: [null, [Validators.required]],
				rentGrace: [null, [Validators.required]],
				gracePeriod: [
					'',
					[Validators.required, Validators.pattern(/\b(?:1[0-2]|[1-9])\b/)],
				],
				prazoDesconto: [null, [Validators.required]],
				creditTo: [null, [Validators.required]],
			}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.getData();
	}

	getData = async (): Promise<void> => {
		this.unidade = [];

		Promise.all([
			this.getListaProprietarios(),
			this.getReadjustments(),
			this.getRentCreditTypes(),
			this.getContractTypes(),
			this.getRentContractData(this.contractGuid)
		]).then(([ownersList, adjustmentsList, rentCredidtTypesList, contractTypesList, rentContractData]) => {
			if(ownersList) this.showOwnersList(ownersList);
			if(adjustmentsList) this.showAdjustmentsList(adjustmentsList);
			if(rentCredidtTypesList) this.showRentCredidtTypesList(rentCredidtTypesList);
			if(contractTypesList) this.showContractTypesList(contractTypesList);
			if(rentContractData) this.showRentContractData(rentContractData);
		})
		.catch(err => console.error(err))
		.finally(()=> this.isLoading = false);
	};

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
		
		/*
		if (this.editForm.invalid || this.selectedUnits?.length === 0) {
			this.editForm.markAllAsTouched();
			if (this.selectedUnits?.length === 0) {
				this.selectedUnitsInvalid = true;
			}
			return;
		}
		*/
		
		const formData: {
			contractInfo: {
				name: string;
				contractType: number;
				startDate: string;
				endDate: string;
				dueDate: string;
				dataOcupacao: string;
			};
			renterInfo: {
				locatario: string; // x
			};
			valueInfo: {
				rentValue: number;
				taxRetention: string;
				discount: string;
				prazoDesconto: number;
				readjust: number;
				rentGrace: boolean;
				gracePeriod: string;
				creditTo: number;
			};
		} = this.editForm.getRawValue();

		const contractObj: ContratoAluguel = {			
			guidCliente: formData.renterInfo.locatario,
			idTipoCreditoAluguel: formData.valueInfo.creditTo,
			idIndiceReajuste: formData.valueInfo.readjust,
			idTipoContrato: formData.contractInfo.contractType,
			numeroContrato: formData.contractInfo.name,
			valorAluguel: formData.valueInfo.rentValue,
			percentualRetencaoImpostos: +formData.valueInfo.taxRetention,
			percentualDescontoAluguel: +formData.valueInfo.discount,
			prazoDesconto: +formData.valueInfo.prazoDesconto,
			carenciaAluguel: formData.valueInfo.rentGrace,
			prazoCarencia: +formData.valueInfo.gracePeriod,
			dataInicioContrato: formData.contractInfo.startDate,
			dataVencimentoContrato: formData.contractInfo.endDate,
			prazoTotalContrato: this.data.prazoTotalContrato,
			dataOcupacao: formData.contractInfo.dataOcupacao,
			dataVencimentoPrimeraParcela: formData.contractInfo.dueDate,
			periodicidadeReajuste: this.data.periodicidadeReajuste,
			lstImoveis: [
				{
					guidImovel: this.propertyGuid,
					lstUnidades: this.selectedUnits,
				},
			],
			lstImoveisVinculados: this.imoveisCadastrados
		};

		this.rentContractService
			.editContract(this.contractGuid, contractObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
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

	getRentContractData = async (guid: string):Promise<any> => {
		return firstValueFrom(
			this.rentContractService.getContractByGuid(guid)
		);
	};

	getListaProprietarios = async ():Promise<any> => {
		return firstValueFrom(
			this.clienteService.getListaProprietarios()
		);
	};

	getReadjustments = async (): Promise<any> => {
		return firstValueFrom(
			this.commonService.getReadjustment()
		);
	};

	getRentCreditTypes = async (): Promise<any> => {
		return firstValueFrom(
			this.dominiosService.getTiposCreditoAluguel()
		);
	};

	getContractTypes = async (): Promise<any> => {
		return firstValueFrom(
			this.dominiosService.getTiposContrato()
		);
	};

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

	showOwnersList = (ownersList: any):void => {
		if (ownersList) {
			this.renters = [
				{
					label: 'Selecione',
					value: null,
					disabled: true,
				},
			];
			ownersList.data.forEach((item: any) => {
				this.renters.push({
					label: item.nome,
					value: item.guidReferencia,
				});
			});
		};
	};

	showAdjustmentsList = (adjustmentsList: any):void => {
		if (adjustmentsList.success) {
			adjustmentsList.data.forEach(({ nome, id }: { nome: string; id: number }) => {
				this.readjustmentIndex.push({
					label: nome,
					value: id,
				});
			});

			if (this.data?.indiceReajuste.id)
				this.valueInfo['readjust'].setValue(
					+this.data?.indiceReajuste.id
				);
		};
	};

	showRentCredidtTypesList = (rentCredidtTypesList: any): void => {
		if (rentCredidtTypesList.success) {
			rentCredidtTypesList.data.forEach(({ nome, id }: { nome: string; id: number }) => {
				this.creditTo.push({
					label: nome,
					value: id,
				});
			});
	
			if (this.data?.indiceReajuste.id)
				this.valueInfo['creditTo'].setValue(
					+this.data?.indiceReajuste.id
				);
		};
	};

	showContractTypesList = (contractTypesList:any): void => {
		if (contractTypesList) {
			contractTypesList.data.forEach((item: any) => {
				this.contractTypes.push({
					label: item.nome,
					value: item.id,
				});
			});
		};
	};

	showRentContractData = (rentContractData: any):void => {
		if (rentContractData) {
			/*
			const cep = event?.imovelEndereco[0]?.cep.toString() ?? '';
			const formatedCep = `${cep.slice(0, 2)}.${cep.slice(
				2,
				5
			)}-${cep.slice(5)}`;
			*/
			this.data = rentContractData.data;

			this.imovel = this.data.imovelAlugado[0];
			this.imoveisCadastrados = this.data.lstImoveisVinculados;
			this.imoveisCadastrados.forEach((element:any) => {
				element.lstUnidades.forEach((item:any) => {
					this.unidade.push(item);
				});

				this.tipoUnidade = this.unidade?.length > 0
					? this.unidade[0].idTipoUnidadeNavigation?.nome
					: 'Não informado';
			});
			
			this.editForm.controls['contractInfo'].patchValue({
				name: this.data.numeroContrato,
				contractType: this.data.tipoContrato.id,
				startDate: new Date(this.data.dataInicioContrato),
				endDate: new Date(this.data.dataFimContrato),
				dueDate: this.data.dataVencimentoPrimeraParcela ? new Date(this.data.dataVencimentoPrimeraParcela) : '',
				dataOcupacao: new Date(this.data.dataOcupacao),
			});

			const cliente = this.data.cliente;

			this.editForm.controls['renterInfo'].patchValue({
				locatario: cliente.guidReferencia,
			});

			this.isCpf = cliente.cpfCnpj.length <= 11;

			this.editForm.controls['valueInfo'].patchValue({
				rentValue: this.data?.valorAluguel,
				name : this.data?.numeroContrato,
				netValue: this.data?.valorAluguelLiquido,
				taxRetention: this.data?.percentualRetencaoImpostos,
				discount: this.data?.percentualDescontoAluguel,
				readjust: this.data?.indiceReajuste.id,
				rentGrace: this.data?.carenciaAluguel,
				gracePeriod: this.data?.prazoCarencia,
				creditTo: this.data?.creditoAluguel?.id,
				prazoDesconto: this.data?.prazoDesconto,
			});
			this.propertyGuid = this.data.imovelAlugado[0].guidReferencia;
			this.units = this.unidade.map(
				(unit: any) => unit.guidUnidade
			);
		} else {
			this.invalidGuid = true;
		};
	};

}
