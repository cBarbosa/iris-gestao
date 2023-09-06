import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { DominiosService, ImovelService } from 'src/app/shared/services';
import {
	AnexoService
} from 'src/app/shared/services/anexo.service';
import { ConstructionService } from 'src/app/shared/services/obra.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
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
	[label: string]: any;
};

@Component({
	selector: 'app-construction-register',
	templateUrl: './construction-register.component.html',
	styleUrls: ['./construction-register.component.scss'],
})
export class ConstructionRegisterComponent {
	registerForm: FormGroup;
	propertyAddForm: FormGroup;

	stepList: Step[];
	currentStep: number;

	onInputDate: Function;
	onBlurDate: Function;

	isMobile = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	linkedProperties: {
		nome: string;
		guid: string;
		type: number;
		unidades: {
			guid: string;
			name: string;
		}[];
	}[] = [];
	linkedPropertiesInvalid = false;
	editingLinkedProperty: string | null = null;
	propertyAddVisible = false;

	opcoesTipoImovel: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	opcoesPropriedades: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		}
	];

	propertiesList: Array<{
		label: string;
		value: any,
		units: Array<{
			units: any
		}>
	}> = [];

	opcoesUnidades: DropdownItem[] = [];

	attachments: File[] = [];

	propertyType = '';

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private constructionService: ConstructionService,
		private dominiosService: DominiosService,
		private imovelService: ImovelService,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit() {
		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Selecione o imóvel',
				isCurrent: this.currentStep === 1,
				isVisited: false,
			},
			{
				label: 'Dados da obra',
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
			selecaoImovel: this.fb.group({
				tipoImovel: [null, Validators.required],
				// imovel: ['', Validators.required],
			}),
			dadosObra: this.fb.group({
				nome: ['', Validators.required],
				dataInicio: [null, Validators.required],
				dataFim: [null, Validators.required],
				valorOrcamento: ['', Validators.required],
			}),
			anexos: this.fb.group({}),
		});

		this.propertyAddForm = this.fb.group({
			edificio: [null, Validators.required],
			unidade: [null, [Validators.required]],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		// this.getListaFornecedores();
		// this.getFormasPagamento();
		// this.getIndicesReajuste();
		this.getAllProperties();
		this.getAllPropertyCategories();
	}

	get selecaoImovelForm() {
		return this.registerForm.controls['selecaoImovel'] as FormGroup;
	}

	get dadosObraForm() {
		return this.registerForm.controls['dadosObra'] as FormGroup;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		if (this.currentStep === 1) return this.selecaoImovelForm.controls;
		if (this.currentStep === 2) return this.dadosObraForm.controls;
		return this.dadosObraForm.controls;
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
				stepData.isValid = this.selecaoImovelForm.valid ? true : false;
			} else if (stepListIndex === 2) {
				stepData.isValid = this.dadosObraForm.valid ? true : false;
			} else if (stepListIndex === 3) {
				// stepData.isValid = this.attachmentsForm.valid ? true : false;
			}

			if (step > stepListIndex) {
				if (stepListIndex === 2) {
				} else if (stepListIndex === 3) {
					// stepData.isValid = this.attachmentsForm.valid ? true : false;
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
			this.selecaoImovelForm.updateValueAndValidity();
			if (this.selecaoImovelForm.invalid) {
				this.selecaoImovelForm.markAllAsTouched();
				return;
			}

			if (this.linkedProperties.length === 0) {
				this.linkedPropertiesInvalid = true;
				return;
			}
		}
		if (currStep === 2) {
			this.dadosObraForm.updateValueAndValidity();
			if (this.dadosObraForm.invalid) {
				this.dadosObraForm.markAllAsTouched();
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

	onFileSelect(e: any) {
		this.attachments = e;
	}

	onSubmit(e: any = null) {

		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		const formData: {
			selecaoImovel: {
				tipoImovel: number;
				imovel: string;
			};
			dadosObra: {
				nome: string;
				dataInicio: string;
				dataFim: string;
				valorOrcamento: number;
			};
		} = this.registerForm.getRawValue();

		const linkedProperty = this.linkedProperties[0];

		const unitGuidReferences = linkedProperty.unidades.map(item => {
			return item.guid;
		});

		const constructionObj: {
			ImovelGuidReference: string;
			Nome: string;
			DataInicio: string;
			DataPrevistaTermino: string;
			ValorOrcamento: number;
			UnidadeGuidReferences: Array<string>;
		} = {
			ImovelGuidReference: linkedProperty.guid,
			Nome: formData.dadosObra.nome,
			DataInicio: formData.dadosObra.dataInicio,
			DataPrevistaTermino: formData.dadosObra.dataFim,
			ValorOrcamento: formData.dadosObra.valorOrcamento,
			UnidadeGuidReferences: unitGuidReferences
		};

		const registerAttachments = (guid: string) => {
			const formData = new FormData();

			this.attachments.forEach((file) => {
				formData.append('files', file);
			});

			this.anexoService.registerFile(guid, formData, 'outrosdocs').subscribe();
		};

		this.constructionService
			.registerConstruction(constructionObj)
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
	}

	onProprietarySubmit(e: any = null) {

		if(!this.propertyAddForm.valid)	{
			this.linkedPropertiesInvalid = true;
			return;
		}

		const formData: {
			edificio: {
				guid: string;
				name: string;
				type: number;
			};
			unidade: {
				guid: string;
				name: string;
			}[];
		} = this.propertyAddForm.getRawValue();

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
					type: formData.edificio.type,
					unidades: formData.unidade,
				});
			}
		} else {
			const index = this.linkedProperties.findIndex(
				(p) => p.guid === this.editingLinkedProperty
			);

			this.linkedProperties.splice(index, 1, {
				nome: formData.edificio.name,
				guid: formData.edificio.guid,
				type: formData.edificio.type,
				unidades: formData.unidade,
			});

			this.linkedProperties = [...this.linkedProperties];
		}

		if (this.linkedProperties.length !== 0) {
			this.linkedPropertiesInvalid = false;
		}

		this.propertyAddForm.reset();

		this.hideAddProperty();
	}

	onChangeBuilding(event: any) {
		const building = this.opcoesPropriedades.find(
			(b) => b.value?.guid === event?.guid
		);

		if (building?.value !== null)
			this.propertyAddForm.controls['unidade'].enable();
		else this.propertyAddForm.controls['unidade'].disable();

		this.propertyAddForm.controls['unidade'].setValue(null);

		this.opcoesUnidades = [];

		building?.['units']?.forEach((item: any) => {
			this.opcoesUnidades.push({
				label: item.tipo,
				value: {
					guid: item.guidReferencia,
					name: item.tipo,
				},
			});
		});
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
				type: property.type
			},
			unidade: property.unidades
		});

		const building = this.opcoesPropriedades.find(
			(b) => b.value?.guid === property.guid
		);

		this.propertyAddForm.controls['unidade'].enable();

		this.propertyAddForm.controls['unidade'].setValue([]);

		this.opcoesUnidades = [];

		building?.['units']?.forEach((item: any) => {
			const value = {
				guid: item.guidReferencia,
				name: item.tipo
			};

			this.opcoesUnidades.push({
				label: item.tipo,
				value: value
			});

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

	changePropertiesTypes(event: any) {

		const building = this.propertiesList.filter(
			(b) => b.value.type === event.value
		);

		this.opcoesPropriedades = [];
		this.opcoesUnidades = [];

		building.forEach((item:any) => {
			this.opcoesPropriedades.push(item);
		});

		this.opcoesPropriedades.unshift({
			label: 'Selecione',
			value: null,
			disabled: true,
		});

		this.propertyType = this.opcoesTipoImovel.find((b) => b.value === event.value)?.label ?? '';
		this.resetLinkedProperties();
	};

	getAllProperties = ():void => {
		this.imovelService.getProperties(999, 1).subscribe((event) => {
			if (event) {
				event.data.items.forEach((item: any) => {
					this.propertiesList.push({
						label: item.nome,
						value: {
							guid: item.guidReferencia,
							name: item.nome,
							type: item.idCategoriaImovelNavigation.id
						},
						units: item.unidade
					});
				});
			}
		});
	};

	getAllPropertyCategories = ():void => {
		this.dominiosService.getCategoriaImovel().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.opcoesTipoImovel.push({
						label: item.nome,
						value: item.id
					});
				});
			}
		});
	};
}
