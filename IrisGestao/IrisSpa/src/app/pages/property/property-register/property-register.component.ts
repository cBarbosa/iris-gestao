import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import {
	ClienteService,
	CommonService,
	DominiosService,
	ImovelService,
} from 'src/app/shared/services';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
	EmailValidator,
	CpfCnpjValidator,
	PastDateValidator,
	CpfValidator,
	CnpjValidator,
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
	cpfCnpj?: string;
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
	selectedFiles: {
		habitese?: File;
		projeto?: File;
		matricula?: File;
		outrosdocs?: File[];
	} = {};

	propertyType: string;

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

	proprietaryTypes: DropdownItem[] = [
		{ label: 'Pessoa física', value: 'cpf' },
		{ label: 'Pessoa jurídica', value: 'cnpj' },
	];

	onInputDate: Function;
	onBlurDate: Function;

	prevCepInputValue = '';
	isLoadingCep = false;

	stepList: Step[];
	currentStep: number;

	isSubmitting = false;
	isSubmittingProprietary = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	isMobile = false;

	registerProprietaryVisible = false;

	dropdownUfList: DropdownItem[] = [
		{ label: 'Selecione', value: null, disabled: true },
		{ label: 'Acre', value: 'AC' },
		{ label: 'Alagoas', value: 'AL' },
		{ label: 'Amapá', value: 'AP' },
		{ label: 'Amazonas', value: 'AM' },
		{ label: 'Bahia', value: 'BA' },
		{ label: 'Ceará', value: 'CE' },
		{ label: 'Distrito Federal', value: 'DF' },
		{ label: 'Espírito Santo', value: 'ES' },
		{ label: 'Goías', value: 'GO' },
		{ label: 'Maranhão', value: 'MA' },
		{ label: 'Mato Grosso', value: 'MT' },
		{ label: 'Mato Grosso do Sul', value: 'MS' },
		{ label: 'Minas Gerais', value: 'MG' },
		{ label: 'Pará', value: 'PA' },
		{ label: 'Paraíba', value: 'PB' },
		{ label: 'Paraná', value: 'PR' },
		{ label: 'Pernambuco', value: 'PE' },
		{ label: 'Piauí', value: 'PI' },
		{ label: 'Rio de Janeiro', value: 'RJ' },
		{ label: 'Rio Grande do Norte', value: 'RN' },
		{ label: 'Rio Grande do Sul', value: 'RS' },
		{ label: 'Rondônia', value: 'RO' },
		{ label: 'Roraíma', value: 'RR' },
		{ label: 'Santa Catarina', value: 'SC' },
		{ label: 'São Paulo', value: 'SP' },
		{ label: 'Sergipe', value: 'SE' },
		{ label: 'Tocantins', value: 'TO' },
	];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private imovelService: ImovelService,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private commonService: CommonService,
		private router: Router,
		private anexoService: AnexoService,
		private activatedRoute: ActivatedRoute,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit() {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.propertyType =
			this.activatedRoute.snapshot.parent!.routeConfig!.path!.split('/')[0];

		const validation =
			this.propertyType === 'mercado' ? null : Validators.required;

		this.registerForm = this.fb.group({
			propertyType: this.fb.group({
				name: ['', Validators.required],
				proprietary: [null, Validators.required],
				costCentre: [null, validation],
				zipcode: [null, validation],
				street: [null, validation],
				neighborhood: [null, validation],
				city: [null, validation],
				state: [null, validation],
			}),
			edCorpSalaPavInfo: this.fb.group({
				areaTotal: ['', Validators.required],
			}),
			salaPavInfo: this.fb.group({
				areaUsable: ['', Validators.required],
				areaOccupancy: ['', Validators.required],
			}),
			legalInfo: this.fb.group({
				unitType: [null, Validators.required],
				description: ['', validation],
				registration: ['', validation],
				iptu: ['', validation],
				neoenergia: ['', validation],
				caesb: ['', validation],
				administration: [null, validation],
				potential: [null, validation],
			}),
			legalInfoSalaPav: this.fb.group({
				hasCopies: [false],
				copies: [1],
			}),
			documents: this.fb.group({
				occupancy: [''],
				project: [''],
				registration: [''],
				others: [''],
			}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.registerProprietaryForm = this.fb.group({
			name: ['', [Validators.required]],
			tipoCliente: ['cpf', [Validators.required]],
			cpfCnpj: ['', [Validators.required, CpfCnpjValidator]],
			birthday: ['', [PastDateValidator]],
			email: ['', [Validators.required, EmailValidator]],
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
				label: 'Edifício',
				isCurrent: true,
				isVisited: false,
			},
			{
				label: 'Unidades',
			},
			{
				label: 'Anexos',
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
		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe((event) => {
				console.log('props: ', event);
				if (event) {
					this.proprietaries = [
						{
							label: 'Selecione',
							value: null,
							disabled: true,
						},
					];
					event.data.forEach((item: any) => {
						this.proprietaries.push({
							label: item.nome,
							value: item.id,
							cpfCnpj: item.cpfCnpj,
						});
					});
				}
			});
	}

	setNewProprietary: () => void = () => {};

	get CpfCnpjMask() {
		if (this.registerProprietaryForm.controls['tipoCliente']?.value === 'cpf')
			return '000.000.000-00';
		return '00.000.000/0000-00';
	}

	get currCpfCnpj() {
		if (this.registerProprietaryForm.controls['tipoCliente']?.value === 'cpf')
			return 'CPF';
		return 'CNPJ';
	}

	get isCnpj() {
		if (this.registerProprietaryForm.controls['tipoCliente']?.value === 'cpf')
			return false;
		return true;
	}

	proprietaryTypeChange() {
		if (this.registerProprietaryForm.controls['tipoCliente'].value === 'cpf') {
			this.registerProprietaryForm.controls['cpfCnpj'].setValidators([
				Validators.required,
				CpfValidator,
			]);
			this.registerProprietaryForm.controls['birthday'].setValidators(null);
		} else {
			this.registerProprietaryForm.controls['cpfCnpj'].setValidators([
				Validators.required,
				CnpjValidator,
			]);
			this.registerProprietaryForm.controls['birthday'].setValidators(null);
		}
		this.registerProprietaryForm.controls['cpfCnpj'].updateValueAndValidity();
		this.registerProprietaryForm.controls['birthday'].updateValueAndValidity();
	}

	onAreaChange = () => {
		if (this.propertyType !== 'mercado') return;

		const areaTotalField = this.registerForm
			.get('edCorpSalaPavInfo')
			?.get('areaTotal');
		const areaUsableField = this.registerForm
			.get('salaPavInfo')
			?.get('areaUsable');
		const areaOccupancyField = this.registerForm
			.get('salaPavInfo')
			?.get('areaOccupancy');

		const areaTotal = areaTotalField?.value;
		const areaUsable = areaUsableField?.value;
		const areaOccupancy = areaOccupancyField?.value;

		console.log('++++++++>>>>> ', areaTotal, areaUsable, areaOccupancy);

		if (!areaTotal && !areaUsable && !areaOccupancy) {
			// this.legalInfoForm.markAllAsTouched();
			// this.legalInfoSalaPavForm.markAllAsTouched();
			// this.propertyTypeEdCorpSalaPavForm.markAllAsTouched();
			// this.propertyTypeSalaPavForm.markAllAsTouched();

			areaOccupancyField?.markAsTouched();
			areaTotalField?.markAsTouched();
			areaUsableField?.markAsTouched();
			areaOccupancyField?.addValidators([Validators.required]);
			areaUsableField?.addValidators([Validators.required]);
			areaTotalField?.addValidators([Validators.required]);
		} else {
			areaOccupancyField?.removeValidators([Validators.required]);
			areaUsableField?.removeValidators([Validators.required]);
			areaTotalField?.removeValidators([Validators.required]);
		}

		areaTotalField?.updateValueAndValidity();
		areaOccupancyField?.updateValueAndValidity();
		areaUsableField?.updateValueAndValidity();
	};

	changeStep(step: number) {
		// if (step === 2) this.propertyTypeForm.markAllAsTouched();
		// if (step === 3) this.legalInfoForm.markAllAsTouched();

		console.log('step', step);
		console.log('steplist', this.stepList);

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

			if (step === stepListIndex) {
				stepData.isCurrent = true;
			}

			console.log(i, ':');
			console.log('stepListIndex', stepListIndex);
			console.log('entry', entry);
			console.log('stepData', stepData);

			if (stepListIndex === 1) {
				stepData.isValid = this.propertyTypeForm.valid ? true : false;

				// if (stepData.isValid) {
				// 	const unitTypeValue = this.legalInfoForm.controls['unitType'].value;

				// 	if (unitTypeValue === 1) {
				// 		stepData.isValid = this.propertyTypeEdCorpSalaPavForm.valid
				// 			? true
				// 			: false;
				// 	} else if (unitTypeValue === 2 || unitTypeValue === 3) {
				// 		stepData.isValid = this.propertyTypeEdCorpSalaPavForm.valid
				// 			? this.propertyTypeSalaPavForm.valid
				// 				? true
				// 				: false
				// 			: false;
				// 	}
				// }
				console.log('stepData after 1', stepData);
			} else if (stepListIndex === 2) {
				stepData.isValid = this.legalInfoForm.valid ? true : false;

				if (stepData.isValid) {
					const unitTypeValue = this.legalInfoForm.controls['unitType'].value;

					// if (unitTypeValue === 2 || unitTypeValue === 3) {
					// 	stepData.isValid = this.legalInfoSalaPavForm.valid;
					// }

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
				console.log('stepData after 2', stepData);
			} else if (stepListIndex === 3) {
				stepData.isValid = this.documentsForm.valid ? true : false;
				console.log('stepData after 3', stepData);
			}

			if (step > stepListIndex) {
				if (stepListIndex === 2) {
				} else if (stepListIndex === 3) {
					stepData.isValid = this.legalInfoForm.valid ? true : false;
				}
			}

			return stepData;
		});

		this.currentStep = step;
	}

	updateStepValidity(unitType?: number) {
		unitType ??= this.legalInfoForm.controls['unitType'].value;

		if (unitType === 1) {
			this.propertyTypeEdCorpSalaPavForm.controls['areaTotal'].addValidators([
				Validators.required,
			]);
			this.propertyTypeEdCorpSalaPavForm.markAllAsTouched();
			this.propertyTypeEdCorpSalaPavForm.controls[
				'areaTotal'
			].updateValueAndValidity();
		} else if (unitType === 2 || unitType === 3) {
			this.onAreaChange();
			// this.propertyTypeEdCorpSalaPavForm.controls['areaTotal'].addValidators([
			// 	Validators.required,
			// ]);
			// this.propertyTypeSalaPavForm.controls['areaUsable'].addValidators([
			// 	Validators.required,
			// ]);
			// this.propertyTypeSalaPavForm.controls['areaOccupancy'].addValidators([
			// 	Validators.required,
			// ]);
		}
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

		console.log('IHULLLLLLLLL', this.propertyTypeEdCorpSalaPavForm.invalid);

		if (currStep === 1) {
			if (this.propertyTypeForm.invalid) {
				this.propertyTypeForm.markAllAsTouched();
				return;
			}
		}
		if (currStep === 2) {
			if (this.legalInfoForm.controls['unitType'].value === 1) {
				if (this.propertyTypeEdCorpSalaPavForm.invalid) {
					this.propertyTypeEdCorpSalaPavForm.markAllAsTouched();
					return;
				}
			} else if (
				this.legalInfoForm.controls['unitType'].value === 2 ||
				this.legalInfoForm.controls['unitType'].value === 3
			) {
				if (
					this.legalInfoForm.invalid ||
					this.legalInfoSalaPavForm.invalid ||
					this.propertyTypeEdCorpSalaPavForm.invalid ||
					this.propertyTypeSalaPavForm.invalid
				) {
					this.legalInfoForm.markAllAsTouched();
					this.legalInfoSalaPavForm.markAllAsTouched();

					this.propertyTypeEdCorpSalaPavForm.markAllAsTouched();
					this.propertyTypeSalaPavForm.markAllAsTouched();

					return;
				}
			} else {
				if (this.legalInfoForm.invalid) {
					this.legalInfoForm.markAllAsTouched();
					return;
				}
			}
		}

		console.log(
			'---------------->>>>>>',
			this.legalInfoForm.invalid,
			this.legalInfoSalaPavForm.invalid
		);
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

	// onSelect(
	// 	e: any,
	// 	classificacao: Exclude<ArquivoClassificacoes, 'capa' | 'foto'>
	// ) {
	// 	this.selectedFiles[classificacao] = e.currentFiles[0];

	// 	console.log('selectedFiles', this.selectedFiles);
	// }

	onFileSelect(fileList: File[]) {
		this.selectedFiles['outrosdocs'] = fileList;
	}

	onSubmit(e: any = null) {
		if (
			this.propertyTypeForm.invalid ||
			this.legalInfoForm.invalid ||
			this.documentsForm.invalid ||
			(this.legalInfoForm.controls['unitType'].value === 1 &&
				this.propertyTypeEdCorpSalaPavForm.invalid) ||
			((this.legalInfoForm.controls['unitType'].value === 2 ||
				this.legalInfoForm.controls['unitType'].value === 3) &&
				(this.propertyTypeSalaPavForm.invalid ||
					this.legalInfoSalaPavForm.invalid))
		) {
			this.registerForm.markAllAsTouched();
			return;
		}

		let propertyTypeFormData = this.propertyTypeForm.getRawValue();

		if (this.legalInfoForm.controls['unitType'].value === 1) {
			propertyTypeFormData = {
				...propertyTypeFormData,
				...this.propertyTypeEdCorpSalaPavForm.getRawValue(),
			};
		} else if (
			this.legalInfoForm.controls['unitType'].value === 2 ||
			this.legalInfoForm.controls['unitType'].value === 3
		) {
			propertyTypeFormData = {
				...propertyTypeFormData,
				...this.propertyTypeEdCorpSalaPavForm.getRawValue(),
				...this.propertyTypeSalaPavForm.getRawValue(),
			};
		}

		let legalInfoFormData = this.legalInfoForm.getRawValue();

		if (
			this.legalInfoForm.controls['unitType'].value === 2 ||
			this.legalInfoForm.controls['unitType'].value === 3
		) {
			legalInfoFormData = {
				...legalInfoFormData,
				...this.legalInfoSalaPavForm.getRawValue(),
			};
		}
		let idCategoria = this.propertyType === 'mercado' ? 2 : 1;

		const propertyObj = {
			Nome: propertyTypeFormData.name,
			IdCategoriaImovel: idCategoria,
			IdClienteProprietario: +propertyTypeFormData.proprietary,
			NumCentroCusto: +propertyTypeFormData.costCentre,
			CEP: +propertyTypeFormData.zipcode,
			Rua: propertyTypeFormData.street,
			Cidade: propertyTypeFormData.city,
			Bairro: propertyTypeFormData.neighborhood,
			UF: propertyTypeFormData.state,
			MonoUsuario: false,
		};

		const unitObj = {
			Tipo: legalInfoFormData.description,
			IdTipoUnidade: +legalInfoFormData.unitType,
			AreaUtil: propertyTypeFormData.areaUsable ?? 0,
			AreaTotal: +propertyTypeFormData.areaTotal,
			AreaHabitese: propertyTypeFormData.areaOccupancy ?? 0,
			Matricula: legalInfoFormData.registration,
			InscricaoIptu: legalInfoFormData.iptu,
			MatriculaEnergia: legalInfoFormData.neoenergia,
			MatriculaAgua: legalInfoFormData.caesb,
			TaxaAdministracao: +legalInfoFormData.administration,
			ValorPotencial: +legalInfoFormData.potential,
			QtdeCopias: legalInfoFormData.copies ?? 1,
			UnidadeLocada: false,
		};

		const registerUnit = (unitObj: any, guid: string) => {
			this.imovelService
				.registerUnit(unitObj, guid)
				.pipe(first())
				.subscribe({
					next: (response: any) => {
						if (response.success) {
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

		const registerAttachments = (guid: string) => {
			Object.entries(this.selectedFiles).forEach(([classificacao, file]) => {
				const formData = new FormData();

				if (!Array.isArray(file)) formData.append('files', file as File);
				else {
					file.forEach((file) => {
						formData.append('files', file as File);
					});
				}

				this.anexoService
					.registerFile(guid, formData, classificacao as ArquivoClassificacoes)
					.subscribe();
			});
		};

		const registerPropertyAndUnit = (propertyObj: any, unitObj: any) => {
			this.imovelService
				.registerProperty(propertyObj)
				.pipe(first())
				.subscribe({
					next: (response: any) => {
						if (response.success) {
							registerUnit(unitObj, response.data.guidReferencia);
							registerAttachments(response.data.guidReferencia);
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

		this.isSubmitting = true;

		registerPropertyAndUnit(propertyObj, unitObj);
	}

	onProprietarySubmit() {
		if (this.registerProprietaryForm.invalid) {
			this.registerProprietaryForm.markAllAsTouched();
			return;
		}

		const proprietaryFormData = this.registerProprietaryForm.getRawValue();

		const proprietaryObj = {
			nome: proprietaryFormData.name,
			cpfCnpj: proprietaryFormData.cpfCnpj.toString(),
			dataNascimento:
				proprietaryFormData?.birthday != ''
					? (proprietaryFormData?.birthday as Date)?.toISOString?.()
					: null,
			email: proprietaryFormData.email,
			telefone: proprietaryFormData.telephone.toString(),
			idTipoCliente: 1,
			status: true,
			bairro: '',
			cidade: '',
			estado: '',
			endereco: '',
			razaoSocial: '',
		};

		this.isSubmittingProprietary = true;

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

						this.setNewProprietary = () => {
							this.propertyTypeForm.controls['proprietary'].setValue(
								response.data.id
							);
						};

						// this.registerProprietaryVisible = false;
						this.openModal();
					} else {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message:
								response.message ?? 'Erro no envio de dados de proprietário',
							isError: true,
						};

						// this.registerProprietaryVisible = false;
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

					// this.registerProprietaryVisible = false;
					this.openModal();
				},
			});
	}

	openModal() {
		console.log('openning modal on parent');
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	toggleModal() {
		this.displayModal = !this.displayModal;
	}

	finishForm() {
		console.log('isSubmitting', this.isSubmitting);
		console.log('isSubmittingProprietary', this.isSubmittingProprietary);
		if (this.isSubmitting) {
			this.isSubmitting = false;
			this.navigateTo('property/listing');
		} else {
			this.isSubmittingProprietary = false;
		}
	}

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};

	setAddressByCEP(e: any) {
		const cep = e.target.value.replace(/\D/g, '');

		if (cep.length !== 8 || cep === this.prevCepInputValue) {
			this.prevCepInputValue = cep;
			return;
		}

		this.isLoadingCep = true;
		this.propertyTypeForm.controls['zipcode'].disable();
		this.propertyTypeForm.controls['street'].disable();
		this.propertyTypeForm.controls['neighborhood'].disable();
		this.propertyTypeForm.controls['city'].disable();
		this.propertyTypeForm.controls['state'].disable();

		this.commonService
			.getAddressByCEP(cep)
			.pipe(first())
			.subscribe({
				next: (event) => {
					if (event.success) {
						if (event.data.resultado === '1') {
							this.registerForm.patchValue({
								propertyType: {
									street: event.data.logradouro,
									city: event.data.cidade,
									neighborhood: event.data.bairro,
									state: event.data.uf,
								},
							});

							// this.propertyTypeForm.controls['street'].setValue(event.data.logradouro);
							// this.propertyTypeForm.controls['city'].setValue(event.data.cidade);
							// this.propertyTypeForm.controls['neighborhood'].setValue(event.data.bairro);
							// this.propertyTypeForm.controls['state'].setValue(event.data.uf);
						}
					}

					this.isLoadingCep = false;
					this.propertyTypeForm.controls['zipcode'].enable();
					this.propertyTypeForm.controls['street'].enable();
					this.propertyTypeForm.controls['neighborhood'].enable();
					this.propertyTypeForm.controls['city'].enable();
					this.propertyTypeForm.controls['state'].enable();
				},
				error: (err) => {
					console.error(err);

					this.isLoadingCep = false;
					this.propertyTypeForm.controls['zipcode'].enable();
					this.propertyTypeForm.controls['street'].enable();
					this.propertyTypeForm.controls['neighborhood'].enable();
					this.propertyTypeForm.controls['city'].enable();
					this.propertyTypeForm.controls['state'].enable();
				},
			});

		this.prevCepInputValue = cep;
	}
}
