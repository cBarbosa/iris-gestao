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
	isVisited?: boolean;
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
	registerProprietaryForm: FormGroup;

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

	registerProprietaryVisible = false;

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
				// category: [null, [Validators.required]],
				unitType: [null, [Validators.required]],
				costCentre: [null, [Validators.required]],
			}),
			edCorpSalaPavInfo: this.fb.group({
				areaTotal: ['', [Validators.required]],
			}),
			salaPavInfo: this.fb.group({
				areaUsable: ['', [Validators.required]],
				areaOccupancy: ['', [Validators.required]],
			}),
			legalInfo: this.fb.group({
				description: ['', [Validators.required]],
				registration: ['', [Validators.required]],
				iptu: ['', [Validators.required]],
				neoenergia: ['', [Validators.required]],
				caesb: ['', [Validators.required]],
				administration: ['', [Validators.required]],
				potential: ['', [Validators.required]],
			}),
			legalInfoSalaPav: this.fb.group({
				hasCopies: [false],
				copies: [''],
			}),
			documents: this.fb.group({
				occupancy: [''],
				project: [''],
				registration: [''],
				others: [''],
			}),
		});

		this.registerProprietaryForm = this.fb.group({
			name: ['', [Validators.required]],
			cpfCnpj: ['', [Validators.required]],
			birthday: ['', [Validators.required]],
			email: ['', [Validators.required]],
			telephone: ['', [Validators.required]],
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

		this.getListaProprietarios();

		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Tipo de imóvel',
				isCurrent: true,
				isVisited: false,
			},
			{
				label: 'Informações legais',
			},
			{
				label: 'Documentos',
			},
		];

		// this.changeStep(this.currentStep);
	}

	get propertyTypeForm() {
		return this.registerForm.controls['propertyType'] as FormGroup;
	}

	get propertyTypeSalaPavForm() {
		return this.registerForm.controls['salaPavInfo'] as FormGroup;
	}

	get propertyTypeEdCorpSalaPavForm() {
		return this.registerForm.controls['edCorpSalaPavInfo'] as FormGroup;
	}

	get legalInfoForm() {
		return this.registerForm.controls['legalInfo'] as FormGroup;
	}

	get legalInfoSalaPavForm() {
		return this.registerForm.controls['legalInfoSalaPav'] as FormGroup;
	}

	get documentsForm() {
		return this.registerForm.controls['documents'] as FormGroup;
	}

	getListaProprietarios() {
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
	}

	changeStep(step: number) {
		// if (step === 2) this.propertyTypeForm.markAllAsTouched();
		// if (step === 3) this.legalInfoForm.markAllAsTouched();

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
				stepData.isValid = this.propertyTypeForm.valid ? true : false;

				if (stepData.isValid) {
					const unitTypeValue =
						this.propertyTypeForm.controls['unitType'].value;

					if (unitTypeValue === 1) {
						stepData.isValid = this.propertyTypeEdCorpSalaPavForm.valid
							? true
							: false;
					} else if (unitTypeValue === 2 || unitTypeValue === 3) {
						stepData.isValid = this.propertyTypeEdCorpSalaPavForm.valid
							? this.propertyTypeSalaPavForm.valid
								? true
								: false
							: false;
					}
				}
			} else if (stepListIndex === 2) {
				stepData.isValid = this.legalInfoForm.valid ? true : false;

				if (stepData.isValid) {
					const unitTypeValue =
						this.propertyTypeForm.controls['unitType'].value;

					if (unitTypeValue === 2 || unitTypeValue === 3) {
						stepData.isValid = this.legalInfoSalaPavForm.valid;
					}
				}
			} else if (stepListIndex === 3) {
				stepData.isValid = this.documentsForm.valid ? true : false;
			}

			if (step > stepListIndex) {
				if (stepListIndex === 2) {
				} else if (stepListIndex === 3) {
					stepData.isValid = this.legalInfoForm.valid ? true : false;
				}
			}

			if (step === stepListIndex) {
				stepData.isCurrent = true;
			}

			return stepData;
		});

		this.currentStep = step;
	}

	updateStepValidity() {
		this.changeStep(this.currentStep);
	}

	changeStepCb = (step: number) => {
		if (this.stepList[step - 1].isVisited || step < this.currentStep)
			this.changeStep(step);

		/*
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
		*/
	};

	nextStep() {
		const currStep = this.currentStep;
		if (currStep === 1) {
			if (this.propertyTypeForm.invalid) {
				this.propertyTypeForm.markAllAsTouched();
				return;
			}
			if (this.propertyTypeForm.controls['unitType'].value === 1) {
				if (this.propertyTypeEdCorpSalaPavForm.invalid) {
					this.propertyTypeEdCorpSalaPavForm.markAllAsTouched();
					return;
				}
			} else if (
				this.propertyTypeForm.controls['unitType'].value === 2 ||
				this.propertyTypeForm.controls['unitType'].value === 3
			) {
				if (this.propertyTypeSalaPavForm.invalid) {
					this.propertyTypeEdCorpSalaPavForm.markAllAsTouched();
					this.propertyTypeSalaPavForm.markAllAsTouched();
					return;
				}
			}
		}
		if (currStep === 2) {
			if (
				this.propertyTypeForm.controls['unitType'].value === 2 ||
				this.propertyTypeForm.controls['unitType'].value === 3
			) {
				if (this.legalInfoForm.invalid || this.legalInfoSalaPavForm.invalid) {
					this.legalInfoForm.markAllAsTouched();
					this.legalInfoSalaPavForm.markAllAsTouched();
					return;
				}
			} else {
				if (this.legalInfoForm.invalid) {
					this.legalInfoForm.markAllAsTouched();
					return;
				}
			}
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

	changeHasCopies(e: any) {
		if (e) {
			this.legalInfoSalaPavForm.controls['copies'].setValidators(
				Validators.required
			);
		} else {
			this.legalInfoSalaPavForm.controls['copies'].setValidators(null);
		}
		this.legalInfoSalaPavForm.controls['copies'].updateValueAndValidity();
	}

	onUpload(e: any) {}

	onSubmit(e: any = null) {

		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		let propertyTypeFormData = this.propertyTypeForm.getRawValue();

		if (this.propertyTypeForm.controls['unitType'].value === 1) {
			propertyTypeFormData = {
				...propertyTypeFormData,
				...this.propertyTypeEdCorpSalaPavForm.getRawValue(),
			};
		} else if (
			this.propertyTypeForm.controls['unitType'].value === 2 ||
			this.propertyTypeForm.controls['unitType'].value === 3
		) {
			propertyTypeFormData = {
				...propertyTypeFormData,
				...this.propertyTypeEdCorpSalaPavForm.getRawValue(),
				...this.propertyTypeSalaPavForm.getRawValue(),
			};
		}

		let legalInfoFormData = this.legalInfoForm.getRawValue();

		if (
			this.propertyTypeForm.controls['unitType'].value === 2 ||
			this.propertyTypeForm.controls['unitType'].value === 3
		) {
			legalInfoFormData = {
				...legalInfoFormData,
				...this.legalInfoSalaPavForm.getRawValue(),
			};
		}

		const propertyObj = {
			Nome: propertyTypeFormData.name,
			//IdCategoriaImovel: +propertyTypeFormData.category,
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

	onProprietarySubmit() {
		if (this.registerProprietaryForm.invalid) {
			this.registerProprietaryForm.markAllAsTouched();
			return;
		}

		const proprietaryFormData = this.registerProprietaryForm.getRawValue();

		const proprietaryObj = {
			nome: proprietaryFormData.name,
			cpfCnpj: proprietaryFormData.cpfCnpj,
			dataNascimento: proprietaryFormData.birthday,
			email: proprietaryFormData.email,
			telefone: proprietaryFormData.telephone,
			idTipoCliente: 1,
			bairro: '',
			cidade: '',
			estado: '',
			endereco: '',
			razaoSocial: ''
		};

		this.clienteService
			.criarCliente(proprietaryObj)
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

						this.registerProprietaryForm.reset();
						this.getListaProprietarios();

						this.propertyTypeForm.controls['proprietary'].setValue(
							response.data.id
						);

						// this.registerProprietaryVisible = false;
						this.openModal();
					} else {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message:
								response.message ?? 'Erro no envio de dados de proprietário',
							isError: true,
						};

						this.registerProprietaryVisible = false;
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

					this.registerProprietaryVisible = false;
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
