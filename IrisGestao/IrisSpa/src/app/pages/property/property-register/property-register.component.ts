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
import {
	ClienteService,
	DominiosService,
	ImovelService,
} from 'src/app/shared/services';
import { first } from 'rxjs';
import { Router } from '@angular/router';

type Step = {
	label: string;
	isValid?: boolean;
	isCurrent?: boolean;
};

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-property-register',
	templateUrl: './property-register.component.html',
	styleUrls: ['./property-register.component.scss'],
})
export class PropertyRegisterComponent {
	registerForm: FormGroup;

	unitTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	propertyCategories: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	proprietaries: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	stepList: Step[];
	currentStep: number;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private imovelService: ImovelService,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private router: Router
	) {}

	ngOnInit() {
		this.registerForm = this.fb.group({
			propertyType: this.fb.group({
				name: ['', Validators.required],
				proprietary: [null, [Validators.required]],
				category: [null, [Validators.required]],
				costCentre: [null, [Validators.required]],
			}),
			legalInfo: this.fb.group({
				description: ['', [Validators.required]],
				unitType: [null, [Validators.required]],
				areaTotal: ['', [Validators.required]],
				areaUsable: ['', [Validators.required]],
				areaOccupancy: ['', [Validators.required]],
				registration: ['', [Validators.required]],
				iptu: ['', [Validators.required]],
				neoenergia: ['', [Validators.required]],
				caesb: ['', [Validators.required]],
				administration: ['', [Validators.required]],
				potential: ['', [Validators.required]],
			}),
			documents: this.fb.group({
				occupancy: [''],
				project: [''],
				registration: [''],
				others: [''],
			}),
		});

		this.dominiosService.getTipoUnidade().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.unitTypes.push({
						label: item.nome,
						value: item.id,
					});
				});
			}
		});

		this.dominiosService.getCategoriaImovel().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.propertyCategories.push({
						label: item.nome,
						value: item.id,
					});
				});
			}
		});

		this.clienteService.getListaProprietarios().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.proprietaries.push({
						label: item.nome,
						value: item.id,
					});
				});
			}
		});

		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Tipo de imóvel',
				isCurrent: true,
			},
			{
				label: 'Informações legais',
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

		const propertyTypeFormData = this.propertyTypeForm.getRawValue();
		const legalInfoFormData = this.legalInfoForm.getRawValue();

		const propertyObj = {
			Nome: propertyTypeFormData.name,
			IdCategoriaImovel: +propertyTypeFormData.category,
			IdClienteProprietario: +propertyTypeFormData.proprietary,
			NumCentroCusto: +propertyTypeFormData.costCentre,
			MonoUsuario: false,
		};

		const unitObj = {
			Tipo: legalInfoFormData.description,
			IdTipoUnidade: +legalInfoFormData.unitType,
			AreaUtil: +legalInfoFormData.areaUsable,
			AreaTotal: +legalInfoFormData.areaTotal,
			AreaHabitese: +legalInfoFormData.areaOccupancy,
			Matricula: legalInfoFormData.administration,
			InscricaoIptu: legalInfoFormData.iptu,
			MatriculaEnergia: legalInfoFormData.neoenergia,
			MatriculaAgua: legalInfoFormData.caesb,
			TaxaAdministracao: +legalInfoFormData.administration,
			ValorPotencial: +legalInfoFormData.potential,
			UnidadeLocada: false,
		};
		// name: ['', Validators.required],
		// proprietary: [null, [Validators.required]],
		// unitType: [null, [Validators.required]],
		// costCentre: [null, [Validators.required]],

		// description: ['', [Validators.required]],
		// unitType: [null, [Validators.required]],
		// areaTotal: ['', [Validators.required]],
		// areaUsable: ['', [Validators.required]],
		// areaOccupancy: ['', [Validators.required]],
		// registration: ['', [Validators.required]],
		// iptu: ['', [Validators.required]],
		// neoenergia: ['', [Validators.required]],
		// caesb: ['', [Validators.required]],
		// administration: ['', [Validators.required]],
		// potential: ['', [Validators.required]],

		// Nome = nome do imóvel
		// IdCategoriaImovel = combo de categoria (mercado e carteira)
		// IdClienteProprietario = combo dos clientes
		// NumCentroCusto = número do centro de custo (numéricos)

		// Tipo = descrição da unidade (texto 150)
		// IdTipoUnidade = combo de tipo de imóvel edificio corporativo, sala ...
		// AreaUtil = campo númerico
		// AreaHabitese = campo numérico
		// Matricula = campo texto
		// InscricaoIptu = campo texto
		// MatriculaEnergia = campo texto
		// MatriculaAgua = campo texto
		// TaxaAdministracao = campo monetário
		// ValorPotencial = campo monetário
		// UnidadeLocada = true ou false, se for um problema passa fixo false.

		const registerUnit = (unitObj: any, guid: string) => {
			console.log('sending: ', unitObj);

			this.imovelService
				.registerUnit(unitObj, guid)
				.pipe(first())
				.subscribe({
					next: (response: any) => {
						console.log('response: ', response);

						if (response.success) {
							console.log('DADOS DE UNIDADE ENVIADOS');
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

						this.openModal();
					},
					error: (error: any) => {
						console.error(error);
						this.modalContent = {
							header: 'Cadastro não realizado',
							message: 'Erro no envio de dados',
							isError: true,
						};

						this.openModal();
					},
				});
		};

		const registerPropertyAndUnity = (propertyObj: any, unitObj: any) => {
			this.imovelService
				.registerProperty(propertyObj)
				.pipe(first())
				.subscribe({
					next: (response: any) => {
						console.log('response: ', response);

						if (response.success) {
							registerUnit(unitObj, response.data.guidReferencia);
						} else {
							this.modalContent = {
								header: 'Cadastro não realizado',
								message: response.message ?? 'Erro no envio de dados',
								isError: true,
							};

							this.openModal();
						}
					},
					error: (error: any) => {
						console.error(error);
						this.modalContent = {
							header: 'Cadastro não realizado',
							message: 'Erro no envio de dados',
							isError: true,
						};

						this.openModal();
					},
				});
		};

		registerPropertyAndUnity(propertyObj, unitObj);
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	toggleModal() {
		this.displayModal = !this.displayModal;
	}

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
