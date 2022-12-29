import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../shared/services/cliente.service';
import { DominiosService } from '../../../shared/services/dominios.service';
import { first } from 'rxjs/internal/operators/first';
import { Cliente, ClienteTipo, ClienteType } from 'src/app/shared/models';
import { DatePipe } from '@angular/common';
import { DialogModule, Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import {
	CpfValidator,
	EmailValidator,
	PastDateValidator,
} from 'src/app/shared/validators/custom-validators';

type Step = {
	label: string;
	isValid?: boolean;
	isCurrent?: boolean;
	isVisited?: boolean;
};

@Component({
	selector: 'app-client-edit',
	templateUrl: './client-register.component.html',
	styleUrls: ['./client-register.component.scss'],
	providers: [ClienteService, DatePipe, DialogModule],
})
export class ClientRegisterComponent implements OnInit {
	registerForm: FormGroup;
	uid: string = '';
	isLoadingView: boolean = false;
	displayModal: boolean = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};
	operacaoCriar: boolean = true;
	operacaoClonar: boolean = false;
	unit: Cliente;
	clienteType: ClienteType;
	cliente: any;
	dropdownTipoCliente: any;
	onInputDate: Function;
	onBlurDate: Function;
	tiposCliente = [
		{
			label: 'Selecione',
			value: null,
		},
	];

	stepList: Step[];
	currentStep: number;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private clienteService: ClienteService,
		private dominiosService: DominiosService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';

			if (this.router.url.indexOf('/Clone') > -1) {
				this.operacaoClonar = true;
			}
			console.log('Clone >> ' + this.operacaoClonar);
		});

		this.registerForm = this.fb.group({
			clientInfo: this.fb.group({
				CpfCnpj: ['', [Validators.required, CpfValidator]],
				IdTipoCliente: ['', [Validators.required]],
				Nome: ['', Validators.required],
				razaoSocial: [''],
				DataNascimento: [null, [Validators.required, PastDateValidator]],
				Email: ['', [Validators.required, EmailValidator]],
				Telefone: ['', [Validators.required]],
			}),
			addressInfo: this.fb.group({
				Endereco: [''],
				Bairro: [''],
				Cidade: [''],
				Estado: [''],
				Cep: ['', Validators.required],
			}),
		});
	}

	ngOnInit() {
		this.isLoadingView = true;
		this.getTiposCliente();
		setTimeout(() => {
			if (this.uid != 'new') {
				this.getData();
				this.operacaoCriar = false;
			}
		}, 500);

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
		this.isLoadingView = false;

		this.currentStep = 1;

		this.stepList = [
			{
				label: 'Informações do cliente',
				isCurrent: true,
				isVisited: false,
			},
			{
				label: 'Endereço',
			},
		];
	}

	getData(): void {
		this.isLoadingView = true;

		const view = this.clienteService
			.getClienteById(this.uid)
			?.pipe(first())
			.subscribe((cliente) => {
				this.cliente = cliente;
				var datePipe = new DatePipe('en-US');
				this.isLoadingView = false;
				console.log(
					'cliente >> CPF >> ' +
						datePipe.transform(cliente?.dataNascimento, 'dd/MM/yyyy')
				);
				console.log(
					'cliente >>Tipo Cliente >> ' + cliente?.idTipoClienteNavigation?.id
				);
				const formattedDate = new Date(cliente?.dataNascimento);
				this.registerForm.controls['DataNascimento'].setValue(
					datePipe.transform(cliente?.dataNascimento)
				);

				this.registerForm.patchValue({
					IdTipoCliente: cliente?.idTipoClienteNavigation?.id,
					CpfCnpj: cliente?.cpfCnpj,
					Nome: cliente?.nome,
					DataNascimento: formattedDate,
					Telefone: cliente?.telefone,
					Email: cliente?.email,
					Cep: cliente?.cep,
					Endereco: cliente?.endereco,
					Bairro: cliente?.bairro,
					Cidade: cliente?.cidade,
					Estado: cliente?.estado,
				});
			});
	}

	get clientInfoForm() {
		return this.registerForm.controls['clientInfo'] as FormGroup;
	}

	get addressInfoForm() {
		return this.registerForm.controls['addressInfo'] as FormGroup;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		if (this.currentStep === 1) return this.clientInfoForm.controls;
		if (this.currentStep === 2) return this.addressInfoForm.controls;
		return this.registerForm.controls;
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
				stepData.isValid = this.clientInfoForm.valid ? true : false;
			}

			if (stepListIndex === 2) {
				stepData.isValid = this.addressInfoForm.valid ? true : false;
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
			if (this.clientInfoForm.invalid) {
				this.clientInfoForm.markAllAsTouched();
				return;
			}
		}
		if (currStep === 2) {
			this.onSubmit();
		}

		if (this.currentStep < this.stepList.length)
			this.changeStep(this.currentStep + 1);
	}

	prevStep() {
		if (this.currentStep > 1) this.changeStep(this.currentStep - 1);
		else this.goBack();
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
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

	getTiposCliente(): void {
		const tipoCliente = this.dominiosService
			.getTipoCliente()
			.subscribe((event) => {
				//console.log('getTiposCliente >> TipoCliente >> ' + JSON.stringify(event));
				this.dropdownTipoCliente = event;
				this.dropdownTipoCliente.data.forEach((tipo: any) => {
					this.tiposCliente.push({
						label: tipo.nome,
						value: tipo.id,
					});
				});
			});
	}

	onSubmitOld(e: any = null) {
		console.log('submitting form >> onSubmit');

		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			console.log('onSubmit >> dados >> 2');
			// Object.keys(this.proposalForm.controls).forEach(key => {
			// 	this.proposalForm.get(key)?.markAsDirty()
			// })
			//return;
		}

		this.clienteType = {
			CpfCnpj: this.registerForm.get('CpfCnpj')?.value,
			Nome: this.registerForm.get('Nome')?.value,
			DataNascimento: this.registerForm.get('DataNascimento')?.value,
			Telefone: this.registerForm.get('Telefone')?.value,
			Email: this.registerForm.get('Email')?.value,
			Cep: this.registerForm.get('Cep')?.value,
			Endereco: this.registerForm.get('Endereco')?.value,
			Bairro: this.registerForm.get('Bairro')?.value,
			Cidade: this.registerForm.get('Cidade')?.value,
			Estado: this.registerForm.get('Estado')?.value,
			TipoCliente: this.registerForm.get('IdTipoCliente')?.value,
		};
		console.log('OnSubmit >> Montar objeto >> ' + this.clienteType);
		this.openModal();
		this.saveChanges();
	}

	saveChanges(): void {
		console.log('onSubmit >> dados >> ');
		this.isLoadingView = true;

		this.registerForm = this.fb.group({});

		console.log('OnSubmit >> this.uid >> ' + this.uid);

		if(this.uid === "new"){
			this.clienteService
				.saveUnit(this.clienteType)
				.pipe(first())
				.subscribe({
					next: (response: any) => {
						console.log('response: ', response);

						if (response.success) {
							console.log('DADOS DE UNIDADE ENVIADOS');
							this.modalContent = {
								header: 'Cadastro realizado com sucesso',
								message: response.message,
								isError: false,
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

		if (this.operacaoClonar) {
			console.log('onSubmit >> dados >> FormDados >> Clonar');
			this.clienteService.criarCliente(this.registerForm.value).subscribe({
				next: (response: any) => {
					console.log('onSubmit >> response >> ', response);

					if (response.success) {
						console.log('DADOS DE Cliente ENVIADOS');
						this.modalContent = {
							header: 'Cadastro clonado com sucesso',
							message: response.message,
							isError: false,
						};
					} else {
						this.modalContent = {
							header: 'Clone  não realizado',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Clone não realizado',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
				},
			});
		};

	};

	onSubmit(e: any = null) {
		console.log('onSubmit >> Operação Clonar >> ' + this.operacaoClonar);
		console.log('onSubmit >> Operação Criar >> ' + this.operacaoCriar);
		console.log('onSubmit >> dados >> FormDados >> ' + JSON.stringify(this.registerForm.value));

		if (this.registerForm.invalid) {
			console.log('onSubmit >> Form invalido');
			this.registerForm.markAllAsTouched();
			return;
		}

		if(this.operacaoClonar)
		{
			console.log('onSubmit >> dados >> FormDados >> Clonar');
			this.clienteService
			.criarCliente(this.registerForm.value)
				.subscribe({
					next: (response: any) => {
						console.log('onSubmit >> response >> ', response);

						if (response.success) {
							console.log('DADOS DE Cliente ENVIADOS');
							this.modalContent = {
								header: 'Cadastro realizado com sucesso',
								message: response.message,
								isError: false,
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
		else if(this.uid === "new"){
			console.log('onSubmit >> dados >> FormDados >> New ');
			this.clienteService
			.criarCliente(this.registerForm.value)
				.subscribe({
					next: (response: any) => {
						console.log('onSubmit >> response >> ', response);

						if (response.success) {
							console.log('DADOS DE Cliente ENVIADOS');
							this.modalContent = {
								header: 'Cadastro realizado com sucesso',
								message: response.message,
								isError: false,
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
		else{
			console.log('onSubmit >> dados >> FormDados >> Update ');
			this.clienteService
				.atualizarCliente(this.uid, this.registerForm.value)
				.subscribe({
					next: (response: any) => {
						console.log('onSubmit >> update >> ', response);

						if (response.success) {
							console.log('DADOS DE UNIDADE ENVIADOS');
							this.modalContent = {
								header: 'Atualização realizada com sucesso',
								message: response.message,
							};
						} else {
							this.modalContent = {
								header: 'Atualização não realizada',
								message: response.message,
								isError: true,
							};
						}

						this.openModal();
					},
					error: (error: any) => {
						console.error(error);
						this.modalContent = {
							header: 'Atualização não realizada',
							message: 'Erro no envio de dados',
							isError: true,
						};

						this.openModal();
					},
				});
		}

		console.log('form submitted');
		return;
	}

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
