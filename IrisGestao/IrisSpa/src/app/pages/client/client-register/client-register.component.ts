import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../shared/services/cliente.service';
import { DominiosService } from '../../../shared/services/dominios.service';
import { first } from 'rxjs/internal/operators/first';
import { Cliente, ClienteType } from 'src/app/shared/models';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import {
	CnpjValidator,
	CpfCnpjValidator,
	CpfValidator,
	EmailValidator,
	PastDateValidator,
} from 'src/app/shared/validators/custom-validators';
import { CommonService } from 'src/app/shared/services/common.service';
import { Contato } from 'src/app/shared/models/contato.model';

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
	selector: 'app-client-edit',
	templateUrl: './client-register.component.html',
	styleUrls: ['./client-register.component.scss'],
	providers: [ClienteService, DatePipe, DialogModule],
})
export class ClientRegisterComponent implements OnInit {
	registerForm: FormGroup;
	uid: string = '';
	isLoadingData: boolean = false;
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
	cliente: any;
	onInputDate: Function;
	onBlurDate: Function;

	linkedContact: {
		dataCriacao: string;
		nome: string;
		email: string;
		telefone: string;
		cargo: string;
		dataNascimento: Date;
	} | null;
	contactRegisterVisible = false;

	prevCepInputValue = '';
	isLoadingCep = false;

	stepList: Step[];
	currentStep: number;

	dropDownClientTypeList: DropdownItem[] = [
		{ label: 'Pessoa física', value: 'cpf' },
		{ label: 'Pessoa jurídica', value: 'cnpj' },
	];
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
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private clienteService: ClienteService,
		private dominiosService: DominiosService,
		private commonService: CommonService
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? 'new';

			if (this.router.url.indexOf('/Clone') > -1) {
				this.operacaoClonar = true;
			}
		});

		if (this.uid !== 'new') this.operacaoCriar = false;

		this.registerForm = this.fb.group({
			clientInfo: this.fb.group({
				CpfCnpj: ['', [Validators.required, CpfValidator]],
				tipoCliente: ['cpf', [Validators.required]],
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

		this.getData();

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

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
		if (this.uid == 'new') {
			return;
		}

		this.isLoadingData = true;
		var datePipe = new DatePipe('en-US');

		const view = this.clienteService
			.getClienteById(this.uid)
			?.pipe(first())
			.subscribe((cliente) => {
				this.cliente = cliente;

				const formattedDate = new Date(cliente?.dataNascimento);
				// this.registerForm.controls['DataNascimento'].setValue(
				// 	datePipe.transform(cliente?.dataNascimento)
				// );

				this.prevCepInputValue = cliente?.cep;

				this.registerForm.patchValue({
					clientInfo: {
						CpfCnpj: cliente.cpfCnpj,
						Nome: cliente?.nome,
						razaoSocial: cliente?.nome,
						DataNascimento: formattedDate,
						Telefone: cliente?.telefone,
						Email: cliente?.email,
						tipoCliente: cliente.cpfCnpj.length > 11 ? 'cnpj' : 'cpf',
					},
					addressInfo: {
						Cep: cliente?.cep,
						Endereco: cliente?.endereco,
						Bairro: cliente?.bairro,
						Cidade: cliente?.cidade,
						Estado: cliente?.estado,
					},
				});

				this.stepList = [
					{
						label: 'Informações do cliente',
						isCurrent: true,
						isVisited: true,
					},
					{
						label: 'Endereço',
						isVisited: true,
					},
				];
				this.isLoadingData = false;
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

	get CpfCnpjMask() {
		if (this.f['tipoCliente'].value === 'cpf') return '000.000.000-00';
		return '00.000.000/0000-00';
	}

	get currCpfCnpj() {
		if (this.f['tipoCliente'].value === 'cpf') return 'CPF';
		return 'CNPJ';
	}

	get isCnpj() {
		if (this.f['tipoCliente'].value === 'cpf') return false;
		return true;
	}

	clientTypeChange() {
		if (this.f['tipoCliente'].value === 'cpf') {
			this.f['CpfCnpj'].setValidators([Validators.required, CpfValidator]);
		} else {
			this.f['CpfCnpj'].setValidators([Validators.required, CnpjValidator]);
		}
		this.f['CpfCnpj'].updateValueAndValidity();
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

	showContactRegister() {
		this.contactRegisterVisible = true;
	}

	hideContactRegister = () => {
		this.contactRegisterVisible = false;
	};

	resetLinkedContact() {
		this.linkedContact = null;
	}

	onUpdateContactLinked = ({
		idFornecedor,
		nome,
		email,
		telefone,
		cargo,
		dataNascimento,
	}: {
		idFornecedor: string | null;
		nome: string;
		email: string;
		telefone: string;
		cargo: string;
		dataNascimento: Date;
	}) => {
		this.hideContactRegister();

		this.linkedContact = {
			dataCriacao: new Date().toISOString(),
			nome,
			email,
			telefone,
			cargo,
			dataNascimento: dataNascimento,
		};
	};

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

	setAddressByCEP(e: any) {
		const cep = e.target.value.replace(/\D/g, '');

		if (cep.length !== 8 || cep === this.prevCepInputValue.toString()) {
			this.prevCepInputValue = cep;
			return;
		}
		this.isLoadingCep = true;
		this.addressInfoForm.controls['Cep'].disable();
		this.addressInfoForm.controls['Endereco'].disable();
		this.addressInfoForm.controls['Bairro'].disable();
		this.addressInfoForm.controls['Cidade'].disable();
		this.addressInfoForm.controls['Estado'].disable();

		this.commonService
			.getAddressByCEP(cep)
			.pipe(first())
			.subscribe({
				next: (event) => {
					if (event.success) {
						if (event.data.resultado === '1') {
							this.addressInfoForm.controls['Endereco'].setValue(
								event.data.logradouro
							);
							this.addressInfoForm.controls['Bairro'].setValue(
								event.data.bairro
							);
							this.addressInfoForm.controls['Cidade'].setValue(
								event.data.cidade
							);
							this.addressInfoForm.controls['Estado'].setValue(event.data.uf);
						}
					} else {
					}

					this.isLoadingCep = false;
					this.addressInfoForm.controls['Cep'].enable();
					this.addressInfoForm.controls['Endereco'].enable();
					this.addressInfoForm.controls['Bairro'].enable();
					this.addressInfoForm.controls['Cidade'].enable();
					this.addressInfoForm.controls['Estado'].enable();
				},
				error: (err) => {
					console.error(err);

					this.isLoadingCep = false;
					this.addressInfoForm.controls['Cep'].enable();
					this.addressInfoForm.controls['Endereco'].enable();
					this.addressInfoForm.controls['Bairro'].enable();
					this.addressInfoForm.controls['Cidade'].enable();
					this.addressInfoForm.controls['Estado'].enable();
				},
			});

		this.prevCepInputValue = cep;
	}

	onSubmit(e: any = null) {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		const data: any = {
			CpfCnpj: this.registerForm.value.clientInfo.CpfCnpj,
			Nome: this.registerForm.value.clientInfo.Nome,
			DataNascimento: new Date(
				this.registerForm.value.clientInfo.DataNascimento.getTime() -
					this.registerForm.value.clientInfo.DataNascimento.getTimezoneOffset() *
						60 *
						1000
			)
				.toISOString()
				.split('T')[0],
			Telefone: this.registerForm.value.clientInfo.Telefone,
			Email: this.registerForm.value.clientInfo.Email,
			Cep: this.registerForm.value.addressInfo.Cep,
			Endereco: this.registerForm.value.addressInfo.Endereco,
			Bairro: this.registerForm.value.addressInfo.Bairro,
			Cidade: this.registerForm.value.addressInfo.Cidade,
			Estado: this.registerForm.value.addressInfo.Estado,
			RazaoSocial: this.registerForm.value.clientInfo.razaoSocial,
			IdTipoCliente: 1,
			Status: true,
			nps: 0,
		};

		if (
			this.registerForm.value.clientInfo.tipoCliente === 'cnpj' &&
			this.linkedContact
		) {
			data.Contato = {
				idFornecedor: null,
				nome: this.linkedContact.nome,
				email: this.linkedContact.email,
				telefone: this.linkedContact.telefone,
				cargo: this.linkedContact.cargo,
				dataNascimento: new Date(
					this.linkedContact.dataNascimento.getTime() -
						this.linkedContact.dataNascimento.getTimezoneOffset() * 60 * 1000
				)
					.toISOString()
					.split('T')[0],
			};
		}

		console.log('sending', data);

		if (this.operacaoClonar) {
			this.clienteService.criarCliente(data).subscribe({
				next: (response: any) => {
					if (response.success) {
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
		} else if (this.uid === 'new') {
			this.clienteService.criarCliente(data).subscribe({
				next: (response: any) => {
					if (response.success) {
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
		} else {
			this.clienteService.atualizarCliente(this.uid, data).subscribe({
				next: (response: any) => {
					if (response.success) {
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
	}

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
