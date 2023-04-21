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
import { LinkedProperty } from 'src/app/shared/components/link-property/link-property.component';
import { ClienteService, DominiosService } from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { RevenueService } from 'src/app/shared/services/revenue.service';
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
	selector: 'app-revenue-register',
	templateUrl: './revenue-register.component.html',
	styleUrls: ['./revenue-register.component.scss'],
})
export class RevenueRegisterComponent {
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

	linkedProperty: LinkedProperty;
	linkedPropertyInvalid = false;

	opcoesProprietario: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	opcoesClassificacaoReceita: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	opcoesCreditarPara: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	opcoesParcelas: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	opcoesFormaPagamento: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private dominiosService: DominiosService,
		private revenueService: RevenueService,
		private responsiveService: ResponsiveService,
		private clienteService: ClienteService
	) {}

	ngOnInit() {
		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Informações do imóvel',
				isCurrent: this.currentStep === 1,
				isVisited: false,
			},
			{
				label: 'Informações do cliente',
				isCurrent: this.currentStep === 2,
			},
			{
				label: 'Inforamções da fatura',
				isCurrent: this.currentStep === 3,
			},
		];

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.registerForm = this.fb.group({
			infoImovel: this.fb.group({}),
			infoCliente: this.fb.group({
				proprietario: ['', Validators.required],
			}),
			infoFatura: this.fb.group({
				classificacaoReceita: [null, Validators.required],
				nomeTitulo: [{ value: '', disabled: true }],
				creditarPara: [null, Validators.required],
				formaPagamento: [null, Validators.required],
				parcelas: [null, Validators.required],
				valor: [null, Validators.required],
				dataVencimento: [null, Validators.required],
				impostos: [null, Validators.required],
			}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		for (let i = 1; i <= 12; i++) {
			this.opcoesParcelas.push({
				label: i + (i === 1 ? ' vez' : ' vezes'),
				value: i,
			});
		}

		this.dominiosService
			.getFormasPagamento()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response.data.forEach((forma: any) => {
						this.opcoesFormaPagamento.push({
							label: forma.nome,
							value: forma.id,
						});
					});
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService
			.getTiposCreditoAluguel()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.data.forEach((forma: any) => {
						this.opcoesCreditarPara.push({
							label: forma.nome,
							value: forma.id,
						});
					});
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService
			.getTiposTitulo()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.data
						.filter(({ id }: any) => id !== 1)
						.forEach((forma: any) => {
							this.opcoesClassificacaoReceita.push({
								label: forma.nome,
								value: forma.id,
							});
						});
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.data.forEach((forma: any) => {
						this.opcoesProprietario.push({
							label: forma.nome,
							value: forma.guidReferencia,
						});
					});
				},
				error: (err) => {
					console.error(err);
				},
			});
	}

	get infoImovelForm() {
		return this.registerForm.controls['infoImovel'] as FormGroup;
	}

	get infoClienteForm() {
		return this.registerForm.controls['infoCliente'] as FormGroup;
	}

	get infoFaturaForm() {
		return this.registerForm.controls['infoFatura'] as FormGroup;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		if (this.currentStep === 1) return this.infoImovelForm.controls;
		if (this.currentStep === 2) return this.infoClienteForm.controls;
		return this.infoFaturaForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onPropertySelect(linkedProperties: LinkedProperty[] | LinkedProperty) {
		if (Array.isArray(linkedProperties))
			this.linkedProperty = linkedProperties[0];
		else this.linkedProperty = linkedProperties;
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
				stepData.isValid = this.infoImovelForm.valid ? true : false;
			} else if (stepListIndex === 2) {
				stepData.isValid = this.infoClienteForm.valid ? true : false;
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
			this.infoImovelForm.updateValueAndValidity();
			if (this.infoImovelForm.invalid) {
				this.infoImovelForm.markAllAsTouched();
				return;
			}

			if (this.linkedProperty == null) {
				this.linkedPropertyInvalid = true;
				return;
			}
		}
		if (currStep === 2) {
			this.infoClienteForm.updateValueAndValidity();
			if (this.infoClienteForm.invalid) {
				this.infoClienteForm.markAllAsTouched();
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

	onSubmit(e: any = null) {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		let formData: {
			infoCliente: {
				// tipoImovel: number;
				proprietario: string;
			};
			infoFatura: {
				classificacaoReceita: number;
				nomeTitulo: string;
				creditarPara: number;
				parcelas: number;
				valor: number;
				dataVencimento: Date;
				formaPagamento: number;
				impostos: number;
			};
		} = this.registerForm.getRawValue();

		const revenueObj: {
			NomeTitulo: string;
			idTipoTitulo: number;
			idTipoCreditoAluguel: number;
			guidCliente: string;
			idIndiceReajuste: number | null;
			idFormaPagamento: number;
			DataVencimentoPrimeraParcela: string;
			valorTitulo: number;
			PorcentagemTaxaAdministracao: number;
			parcelas: number;
			lstImoveis: [
				{
					guidImovel: string;
					lstUnidades: string[];
				}
			];
		} = {
			NomeTitulo: formData.infoFatura.nomeTitulo,
			idTipoTitulo: formData.infoFatura.classificacaoReceita,
			idTipoCreditoAluguel: formData.infoFatura.creditarPara,
			guidCliente: formData.infoCliente.proprietario,
			idIndiceReajuste: null,
			idFormaPagamento: formData.infoFatura.formaPagamento,
			DataVencimentoPrimeraParcela:
				formData.infoFatura.dataVencimento.toISOString(),
			valorTitulo: formData.infoFatura.valor,
			PorcentagemTaxaAdministracao: formData.infoFatura.impostos,
			parcelas: formData.infoFatura.parcelas,
			lstImoveis: [
				{
					guidImovel: this.linkedProperty.guid,
					lstUnidades: this.linkedProperty.unidades.map((unit) => unit.guid),
				},
			],
		};

		this.revenueService
			.registerRevenue(revenueObj)
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
	}

	changeClassificacao(event: any) {
		if (event.value === 'outro') {
			this.infoFaturaForm.controls['nomeTitulo'].enable();
		} else {
			this.infoFaturaForm.controls['nomeTitulo'].disable();
		}
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
