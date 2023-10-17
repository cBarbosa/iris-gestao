import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import {formatDate} from '@angular/common';
import { Router } from '@angular/router';
import { first, fromEventPattern } from 'rxjs';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';
import { Utils } from 'src/app/shared/utils';
import { ContratoAluguel } from 'src/app/shared/models/contrato-aluguel.model';
import {
	ClienteService,
	CommonService,
	DominiosService,
	ImovelService,
} from 'src/app/shared/services';
import {
	CnpjValidator,
	CpfValidator,
	EmailValidator,
} from 'src/app/shared/validators/custom-validators';
import {
	AnexoService,
	ArquivoClassificacoes,
} from 'src/app/shared/services/anexo.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';

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
	[label: string]: any;
};

@Component({
	selector: 'app-rent-contract-register',
	templateUrl: './rent-contract-register.component.html',
	styleUrls: ['./rent-contract-register.component.scss'],
})
export class RentContractRegisterComponent {
	registerForm: FormGroup;
	propertyAddForm: FormGroup;
	registerRenterForm: FormGroup;

	isRegistering = false;
	isUnidadeSelecionada = true;

	registerRenterVisible = false;

	stepList: Step[];
	currentStep: number;

	onInputDate: Function;
	onBlurDate: Function;

	isMobile = false;

	linkedProperties: {
		nome: string;
		guid: string;
		tipo: string;
		unidades: {
			guid: string;
			name: string;
		}[];
	}[] = [];
	linkedPropertiesInvalid = false;
	editingLinkedProperty: string | null = null;
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
	];

	renters: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	renterTypes: DropdownItem[] = [
		{ label: 'Pessoa física', value: 'cpf' },
		{ label: 'Pessoa jurídica', value: 'cnpj' },
	];

	dueDates: DropdownItem[] = Array.from({ length: 31 }, (v, k) => {
		return { label: 'Todo dia ' + (k + 1), value: k + 1, disabled: false };
	});

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

	creditTo: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	buildings: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	units: DropdownItem[] = [];

	attachments: File[] = [];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private rentContractService: RentContractService,
		private dominiosService: DominiosService,
		private commonService: CommonService,
		private imovelService: ImovelService,
		private clienteService: ClienteService,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService
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

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.registerForm = this.fb.group({
			contractInfo: this.fb.group({
				numero: ['', Validators.required],
				tipo: [null, Validators.required],
				locatario: [null, Validators.required],
				dataInicio: [null, Validators.required],
				// dataFim: [null, Validators.required],
				prazoTotalContrato: [null, Validators.required],
				dataOcupacao: [null, Validators.required],
				//dataVencimento: [1, Validators.required],
				dataVencimentoPrimeraParcela: [null, Validators.required],
			}),
			valuesInfo: this.fb.group({
				valor: ['', Validators.required],
				// valorLiquido: ['', Validators.required],
				retencao: ['', Validators.required],
				desconto: [null, Validators.required],
				prazoDesconto: [null, Validators.required],
				reajuste: [null, Validators.required],
				periodicidade: [null, Validators.required],
				carencia: [true, Validators.required],
				carenciaPrazo: [null, Validators.required],
				creditarPara: [null, Validators.required],
			}),

			attachmentsInfo: this.fb.group({
				attachment: [null],
			}),
		});

		this.propertyAddForm = this.fb.group({
			edificio: [null, Validators.required],
			unidade: [null, [Validators.required]],
		});

		this.registerRenterForm = this.fb.group({
			name: ['', [Validators.required]],
			tipoCliente: ['cpf', [Validators.required]],
			cpfCnpj: ['', [Validators.required]],
			birthday: ['', [Validators.required]],
			email: ['', [Validators.required, EmailValidator]],
			telephone: ['', [Validators.required]],
		});

		this.propertyAddForm.controls['unidade'].disable();

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

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

		this.commonService.getReadjustment().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.readjustmentIndexes.push({
						label: item.nome,
						value: item.id,
					});
				});
			}
		});

		this.getListaProprietarios();

		this.dominiosService.getTiposCreditoAluguel().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.creditTo.push({
						label: item.nome,
						value: item.id,
					});
				});
			}
		});

		this.imovelService.getImoveisDisponiveis().subscribe((event) => {
			if (event) {
				event.forEach((item: any) => {
					this.buildings.push({
						label: item.nomeImovel,
						value: {
							guid: item.guidImovel,
							name: item.nomeImovel,
						},
						units: item.lstUnidade,
					});
				});
			}
		});
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

	getListaProprietarios() {
		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe((event) => {
				if (event) {
					this.renters = [
						{
							label: 'Selecione',
							value: null,
							disabled: true,
						},
					];
					event.data.forEach((item: any) => {
						this.renters.push({
							label: item.nome,
							value: item.guidReferencia,
						});
					});
				}
			});
	}

	setNewRenter: () => void = () => {};

	get CpfCnpjMask() {
		if (this.registerRenterForm.controls['tipoCliente']?.value === 'cpf')
			return '000.000.000-00';
		return '00.000.000/0000-00';
	}

	get currCpfCnpj() {
		if (this.registerRenterForm.controls['tipoCliente']?.value === 'cpf')
			return 'CPF';
		return 'CNPJ';
	}

	get isCnpj() {
		if (this.registerRenterForm.controls['tipoCliente']?.value === 'cpf')
			return false;
		return true;
	}

	renterTypeChange() {
		if (this.registerRenterForm.controls['tipoCliente'].value === 'cpf') {
			this.registerRenterForm.controls['cpfCnpj'].setValidators([
				Validators.required,
				CpfValidator,
			]);
			this.registerRenterForm.controls['birthday'].setValidators(
				Validators.required
			);
		} else {
			this.registerRenterForm.controls['cpfCnpj'].setValidators([
				Validators.required,
				CnpjValidator,
			]);
			this.registerRenterForm.controls['birthday'].setValidators(null);
		}
		this.registerRenterForm.controls['cpfCnpj'].updateValueAndValidity();
		this.registerRenterForm.controls['birthday'].updateValueAndValidity();
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
			this.contractInfoForm.updateValueAndValidity();
			if (this.contractInfoForm.invalid) {
				this.contractInfoForm.markAllAsTouched();

				if (this.linkedProperties.length === 0) {
					this.linkedPropertiesInvalid = true;
				}
				return;
			}
		}
		if (currStep === 2) {
			this.valuesInfoForm.updateValueAndValidity();
			if (this.valuesInfoForm.invalid) {
				this.valuesInfoForm.markAllAsTouched();
				return;
			}
		}
		if (currStep === 3) {
			this.onSubmit();
		}

		window.scrollTo(0, 0);

		if (this.currentStep < this.stepList.length)
			this.changeStep(this.currentStep + 1);
	}

	prevStep() {
		if (this.currentStep > 1) this.changeStep(this.currentStep - 1);
		else this.goBack();
	}

	onHasGracePeriodChange() {
		const carencia = this.valuesInfoForm.controls['carencia'].value;

		if (carencia)
			this.valuesInfoForm.controls['carenciaPrazo'].setValidators(
				Validators.required
			);
		else this.valuesInfoForm.controls['carenciaPrazo'].setValidators(null);

		this.valuesInfoForm.controls['carenciaPrazo'].updateValueAndValidity();
	}

	onUpload(e: any) {}

	onSubmit(e: any = null) {
		if (this.registerForm.invalid || this.linkedProperties.length === 0) {
			this.registerForm.markAllAsTouched();
			if (this.linkedProperties.length === 0) {
				this.linkedPropertiesInvalid = true;
			}
			return;
		}

		this.isRegistering = true;

		const formData: {
			contractInfo: {
				numero: string; // x
				tipo: number; // x
				locatario: string; // x
				dataInicio: string; // x
				// dataFim: string;
				prazoTotalContrato: number;
				dataOcupacao: string; // x
				dataVencimento: number; // x
				dataVencimentoPrimeraParcela: string;
			};
			valuesInfo: {
				valor: number; // x
				// valorLiquido: number;
				retencao: string; // x
				desconto: string; // x
				prazoDesconto: string; // x
				reajuste: number; // x
				periodicidade: string; // x
				carencia: boolean; // x
				carenciaPrazo: string; // x
				creditarPara: number; // x
			};
			attachmentsInfo: {
				attachment: null;
			};
		} = this.registerForm.getRawValue();

		let dataFim = formatDate(new Date(), 'yyyy-MM-ddThh:MM:ss', 'en');
		const contractObj: ContratoAluguel = {
			guidCliente: formData.contractInfo.locatario,
			idTipoCreditoAluguel: formData.valuesInfo.creditarPara,
			idIndiceReajuste: formData.valuesInfo.reajuste,
			idTipoContrato: formData.contractInfo.tipo,
			numeroContrato: formData.contractInfo.numero,
			valorAluguel: formData.valuesInfo.valor,
			percentualRetencaoImpostos: +formData.valuesInfo.retencao,
			percentualDescontoAluguel: +formData.valuesInfo.desconto,
			prazoDesconto: +formData.valuesInfo.prazoDesconto,
			carenciaAluguel: formData.valuesInfo.carencia,
			prazoCarencia: +formData.valuesInfo.carenciaPrazo,
			dataInicioContrato: formData.contractInfo.dataInicio,
			dataVencimentoContrato: dataFim,
			prazoTotalContrato: +formData.contractInfo.prazoTotalContrato, //???
			dataOcupacao: formData.contractInfo.dataOcupacao,
			//diaVencimentoAluguel: formData.contractInfo.dataVencimento,
			dataVencimentoPrimeraParcela:
				formData.contractInfo.dataVencimentoPrimeraParcela,
			periodicidadeReajuste: +formData.valuesInfo.periodicidade,
			lstImoveis: this.linkedProperties.map((p) => {
				return {
					guidImovel: p.guid,
					lstUnidades: p.unidades.map((u) => u.guid),
				};
			}),
			lstImoveisVinculados: []
		};

		console.debug('contractObj', contractObj);

		this.rentContractService
			.registerContract(contractObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						registerAttachments(response.data.guidReferencia);

						this.modalContent = {
							header: 'Cadastro realizado com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message: response.message,
							isError: true,
						};
					}

					this.isRegistering = false;

					this.openModal();
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Cadastro não realizado',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.isRegistering = false;
					this.openModal();
				},
			});

		const registerAttachments = (guid: string) => {
			const formData = new FormData();
			this.attachments.forEach((file) => {
				formData.append('files', file);
			});
			this.anexoService.registerFile(guid, formData, 'outrosdocs').subscribe();
		};
	}

	onProprietarySubmit(e: any = null) {
		const formData: {
			edificio: {
				guid: string;
				name: string;
			};
			unidade: {
				guid: string;
				name: string;
			}[];
		} = this.propertyAddForm.getRawValue();
		console.log('Unidade selecionada >> ' + JSON.stringify(formData.unidade));
		if(formData.unidade === null){
			return;
		}
		if (this.editingLinkedProperty === null) {
			const isDuplicate = this.linkedProperties.some(({ unidades }) => {
				return unidades.some(({ guid: linkedGuid }) => {
					return formData.unidade.some(({ guid }) => linkedGuid === guid);
				});
			});

			if (!isDuplicate) {
				this.linkedProperties.push({
					nome: formData.edificio.name,
					guid: formData.edificio.guid,
					tipo: 'Edifício Coorporativo',
					unidades: formData.unidade,
				});
			}
			console.log('aki 1');
		} else {
			const index = this.linkedProperties.findIndex(
				(p) => p.guid === this.editingLinkedProperty
			);

			this.linkedProperties.splice(index, 1, {
				nome: formData.edificio.name,
				guid: formData.edificio.guid,
				tipo: 'Edifício Coorporativo',
				unidades: formData.unidade,
			});
			
			this.linkedProperties = [...this.linkedProperties];
			console.log('aki 2');
		}

		if (this.linkedProperties.length !== 0 || formData.unidade == null) {
			this.linkedPropertiesInvalid = false;
		}

		this.propertyAddForm.reset();

		this.hideAddProperty();
	}

	onRenterSubmit() {
		if (this.registerRenterForm.invalid) {
			this.registerRenterForm.markAllAsTouched();
			return;
		}

		const renterFormData = this.registerRenterForm.getRawValue();
		console.log(renterFormData);

		const renterObj = {
			nome: renterFormData.name,
			cpfCnpj: renterFormData.cpfCnpj.toString(),
			dataNascimento: renterFormData.birthday
				? (renterFormData.birthday as Date).toISOString()
				: null,
			email: renterFormData.email,
			telefone: renterFormData.telephone.toString(),
			idTipoCliente: 1,
			status: true,
			bairro: '',
			cidade: '',
			estado: '',
			endereco: '',
			razaoSocial: '',
		};

		this.clienteService
			.criarCliente(renterObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Cadastro realizado',
							message:
								response.message ??
								'Cadastro de proprietário realizado com sucesso',
							isError: false,
						};

						this.registerRenterForm.reset();

						this.getListaProprietarios();

						console.log('resp', response.data);

						this.setNewRenter = () => {
							this.contractInfoForm.controls['locatario'].setValue(
								response.data.guidReferencia
							);
						};

						// this.registerRenterVisible = false;
						this.openModal();
					} else {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message:
								response.message ?? 'Erro no envio de dados de proprietário',
							isError: true,
						};

						this.registerRenterVisible = false;
						this.openModal();
					}
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Cadastro não realizado',
						message: 'Erro no envio de dados de proprietário',
						isError: true,
					};

					this.registerRenterVisible = false;
					this.openModal();
				},
			});
	}

	onChangeBuilding(event: any) {
		const building = this.buildings.find((b) => b.value?.guid === event?.guid);
		console.log('onChangeBuilding >> ' + event?.guid);
		if (building?.value !== null)
			this.propertyAddForm.controls['unidade'].enable();
		else this.propertyAddForm.controls['unidade'].disable();

		this.propertyAddForm.controls['unidade'].setValue(null);

		this.units = [];

		building?.['units']?.forEach((item: any) => {
			this.units.push({
				label: item.nomeUnidade,
				value: {
					guid: item.guidUnidade,
					name: item.nomeUnidade,
				},
			});
		});
	}

	onChangeUnit(event: any) {
		let unidades = [];
		unidades = event;
		const unitSelected = event?.guid;
		console.log('onChangeUnit >> ' + unidades);
		console.log('building2 >> ' + event?.value);
		if(unidades && (Object.keys(unidades).length === 0))
			this.isUnidadeSelecionada = true;
		else
			this.isUnidadeSelecionada = false;
	}

	updateLinkedPropertiesValidity() {
		if (this.linkedProperties.length === 0) this.linkedPropertiesInvalid = true;
		else this.linkedPropertiesInvalid = false;
	}

	removeLinkedProperty(guid: string) {
		const index = this.linkedProperties.findIndex((p) => p.guid === guid);

		this.linkedProperties.splice(index, 1);
		this.updateLinkedPropertiesValidity();
	}

	editLinkedProperty(property: any) {
		this.propertyAddForm.patchValue({
			edificio: {
				name: property.nome,
				guid: property.guid,
			},
			unidade: property.unidades,
		});

		const building = this.buildings.find(
			(b) => b.value?.guid === property.guid
		);
		this.onChangeBuilding(property.guid);
		this.propertyAddForm.controls['unidade'].enable();

		this.propertyAddForm.controls['unidade'].setValue([]);

		this.units = [];
		building?.['units']?.forEach((item: any) => {
			const value = {
				guid: item.guidReferencia,
				name: item.tipo,
			};

			this.units.push({
				label: item.tipo,
				value: value,
			});
			console.log('building >> ' + JSON.stringify(value));
			if (property.unidades.some((u: any) => u.guid === item.guidReferencia)) {
				
				this.propertyAddForm.controls['unidade'].setValue([
					...this.propertyAddForm.controls['unidade'].value,
					value,
				]);
			}
		});

		this.editingLinkedProperty = property.guid;
		this.showAddProperty();
	}

	resetLinkedProperties() {
		this.linkedProperties = [];
	}

	showAddProperty() {
		this.propertyAddVisible = true;
	}

	hideAddProperty = () => {
		this.editingLinkedProperty = null;
		this.propertyAddForm.patchValue({
			edificio: null,
			unidade: null,
		});
		this.propertyAddVisible = false;
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

	onFileSelect(e: any) {
		console.log('e', e);
		this.attachments = e;
	}
}
