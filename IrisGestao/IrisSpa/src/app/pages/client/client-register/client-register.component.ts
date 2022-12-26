import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../shared/services/cliente.service';
import { DominiosService } from '../../../shared/services/dominios.service';
import { first } from 'rxjs/internal/operators/first';
import { Cliente, ClienteTipo, ClienteType } from 'src/app/shared/models';
import { DatePipe } from '@angular/common';
import { DialogModule, Dialog } from 'primeng/dialog';
import { ButtonModule } from "primeng/button";
import { NgModule } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms'; 
import { Utils } from 'src/app/shared/utils';

type Step = {
	label: string;
	isValid?: boolean;
	isCurrent?: boolean;
}; 

@Component({
	selector: 'app-client-edit',
	templateUrl: './client-register.component.html',
	styleUrls: ['./client-register.component.scss'],
	providers: [ClienteService, DatePipe, DialogModule]
})
export class ClientRegisterComponent implements OnInit {
	editForm: FormGroup;
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
		}
	];

	stepList: Step[];
	currentStep: number;

	constructor(
		private fb: FormBuilder
		, private route: ActivatedRoute
		, private router: Router
		, private location: Location
		, private clienteService: ClienteService
		, private dominiosService: DominiosService)
		{ 
			
		this.route.paramMap.subscribe(paramMap => {
			this.uid = paramMap.get('uid') ?? ''; 
			
			if (this.router.url.indexOf('/Clone') > -1) {
				this.operacaoClonar = true;
			}
			console.log('Clone >> ' + this.operacaoClonar);  
		});

		this.editForm = this.fb.group({
			CpfCnpj: ['', [Validators.required]],
			IdTipoCliente: ['', [Validators.required]],
			Nome: ['', Validators.required],
			razaoSocial: [''],
			Endereco: [''],
			Bairro: [''],
			Cidade: [''],
			Estado: [''],
			Cep: ['', Validators.required],
			DataNascimento: [null, [Validators.required]],
			Email: ['', [Validators.required]],
			Telefone: ['', [Validators.required]],
		});

	};

	ngOnInit() {
		this.isLoadingView = true;
		this.getTiposCliente();
		setTimeout(() => {
			if(this.uid != "new"){
				this.getData();
				this.operacaoCriar = false;
			}
		}, 500);

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
		this.isLoadingView = false;
	}

	getData() : void {
		this.isLoadingView = true;

		const view = this.clienteService
			.getClienteById(this.uid)
			?.pipe(first())
			.subscribe(cliente => {
				this.cliente = cliente;
				var datePipe = new DatePipe("en-US");
				this.isLoadingView = false;
				console.log('cliente >> CPF >> ' + datePipe.transform(cliente?.dataNascimento, 'dd/MM/yyyy'));
				console.log('cliente >>Tipo Cliente >> ' + cliente?.idTipoClienteNavigation?.id);
				const formattedDate=new Date(cliente?.dataNascimento);
				this.editForm.controls[ 'DataNascimento' ].setValue(datePipe.transform(cliente?.dataNascimento));

				this.editForm.patchValue({
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
					Estado: cliente?.estado
				});
				
			});
	}


	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
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
			.subscribe(event => {
				//console.log('getTiposCliente >> TipoCliente >> ' + JSON.stringify(event));
				this.dropdownTipoCliente = event;
				this.dropdownTipoCliente.data.forEach((tipo: any) => {
					this.tiposCliente.push({
						label: tipo.nome,
						value: tipo.id
					});
				});
			});
	}

	onSubmitOld(e: any = null) {
		console.log('submitting form >> onSubmit');

		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			console.log('onSubmit >> dados >> 2');
			// Object.keys(this.proposalForm.controls).forEach(key => {
			// 	this.proposalForm.get(key)?.markAsDirty()
			// })
			//return;
		}
		
		this.clienteType ={
				CpfCnpj: this.editForm.get('CpfCnpj')?.value,
				Nome: this.editForm.get('Nome')?.value,
				DataNascimento: this.editForm.get('DataNascimento')?.value,
				Telefone: this.editForm.get('Telefone')?.value,
				Email: this.editForm.get('Email')?.value,
				Cep: this.editForm.get('Cep')?.value,
				Endereco: this.editForm.get('Endereco')?.value,
				Bairro: this.editForm.get('Bairro')?.value,
				Cidade: this.editForm.get('Cidade')?.value,
				Estado: this.editForm.get('Estado')?.value,
				TipoCliente: this.editForm.get('IdTipoCliente')?.value,
		}
		console.log('OnSubmit >> Montar objeto >> ' + this.clienteType);
		this.openModal();
		this.saveChanges();
	}

	saveChanges() :void 
	{
		console.log('onSubmit >> dados >> ');
		this.isLoadingView = true;

		this.editForm = this.fb.group({
		});

		console.log('OnSubmit >> this.uid >> ' + this.uid);

		if(this.uid === "new"){
			const registerUnit = (unitObj: any) => {
				console.log('sending: ', unitObj);
	
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
			};


		}
		else{
			
			this.clienteService
			.updateUnit(this.uid, this.clienteType)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					console.log('response: ', response);

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
		};

	};

	onSubmit(e: any = null) {
		console.log('onSubmit >> Operação Clonar >> ' + this.operacaoClonar);
		console.log('onSubmit >> Operação Criar >> ' + this.operacaoCriar);
		console.log('onSubmit >> dados >> FormDados >> ' + JSON.stringify(this.editForm.value));


		if (this.editForm.invalid) {
			console.log('onSubmit >> Form invalido');
			this.editForm.markAllAsTouched();
			return;
		}

		if(this.operacaoClonar){

			console.log('onSubmit >> dados >> FormDados >> Clonar');
			this.clienteService
			.criarCliente(this.editForm.value)
				.subscribe({
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
		}
		else if(this.uid === "new"){
			const registerUnit = (unitObj: any) => {
				console.log('onSubmit >> Salvar >> sending >> ', unitObj);
	
				console.log('onSubmit >> dados >> FormDados >> New ');
				this.clienteService
				.criarCliente(this.editForm.value)
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
			};
		}
		else{
			console.log('onSubmit >> dados >> FormDados >> Update ');
			this.clienteService
			.atualizarCliente(this.uid, this.editForm.value)
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
		};
		
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
