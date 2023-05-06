import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import {
	CnpjValidator,
	CpfValidator,
	EmailValidator,
	PastDateValidator,
} from 'src/app/shared/validators/custom-validators';
import { Utils } from 'src/app/shared/utils';
import { first } from 'rxjs';
import {
	CommonService,
	DominiosService,
	FornecedorService,
} from 'src/app/shared/services';
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
};

@Component({
	selector: 'app-supplier-register',
	templateUrl: './supplier-register.component.html',
	styleUrls: ['./supplier-register.component.scss'],
})
export class SupplierRegisterComponent implements OnInit {
	uid: string = '';
	isLoadingData: boolean = false;
	registerForm: FormGroup;
	currentStep: number = 1;
	operacaoCriar: boolean = true;
	displayModal: boolean = false;
	operacaoClonar: boolean = false;

	supplier: any;
	onInputDate: Function;
	onBlurDate: Function;

	isMobile = false;

	stepList: Step[];

	dropDownSupplierTypeList: DropdownItem[] = [
		{ label: 'Pessoa física', value: 'cpf' },
		{ label: 'Pessoa jurídica', value: 'cnpj' },
	];

	linkedContact: {
		dataCriacao: string;
		nome: string;
		email: string;
		telefone: string;
		cargo: string;
		dataNascimento: Date;
	} | null;
	contactRegisterVisible = false;

	isLoadingCep: boolean = false;
	prevCepInputValue = '';

	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	dropDownBankList: DropdownItem[] = [
		{
			label: 'Escolha o banco',
			value: null,
		},
	];

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private supplierService: FornecedorService,
		private dominiosService: DominiosService,
		private commonService: CommonService,
		private responsiveService: ResponsiveService
	) {}

	get supplierInfoForm() {
		return this.registerForm.controls['clientInfo'] as FormGroup;
	}

	get addressInfoForm() {
		return this.registerForm.controls['addressInfo'] as FormGroup;
	}

	get bankInfoForm() {
		return this.registerForm.controls['bankInfo'] as FormGroup;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		if (this.currentStep === 1) return this.supplierInfoForm.controls;
		if (this.currentStep === 2) return this.addressInfoForm.controls;
		if (this.currentStep === 3) return this.bankInfoForm.controls;
		return this.registerForm.controls;
	}

	get CpfCnpjMask() {
		if (this.f['tipoFornecedor'].value === 'cpf') return '000.000.000-00';
		return '00.000.000/0000-00';
	}

	get currCpfCnpj() {
		if (this.f['tipoFornecedor'].value === 'cpf') return 'CPF';
		return 'CNPJ';
	}

	get isCnpj() {
		if (this.f['tipoFornecedor'].value === 'cpf') return false;
		return true;
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? 'new';
		});

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		if (this.uid !== 'new') this.operacaoCriar = false;

		this.initForm();

		this.stepList = [
			{
				label: 'Informações do fornecedor',
				isCurrent: true,
				isVisited: false,
			},
			{
				label: 'Endereço',
			},
			{
				label: 'Dados bancários',
			},
		];

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.getData();
		this.getBanks();
	}

	initForm = (): void => {
		this.registerForm = this.fb.group({
			clientInfo: this.fb.group({
				CpfCnpj: ['', [Validators.required, CpfValidator]],
				tipoFornecedor: ['cpf', [Validators.required]],
				Nome: ['', Validators.required],
				razaoSocial: [''],
				DataNascimento: [null, [PastDateValidator]],
				Email: ['', [Validators.required, EmailValidator]],
				Telefone: ['', [Validators.required]],
			}),
			addressInfo: this.fb.group({
				Endereco: ['', Validators.maxLength(100)],
				Bairro: ['', Validators.maxLength(50)],
				Cidade: ['', Validators.maxLength(50)],
				Estado: [''],
				Cep: ['', Validators.required],
			}),
			bankInfo: this.fb.group({
				IdBanco: [''],
				Agencia: ['', Validators.maxLength(5)],
				Conta: ['', Validators.maxLength(9)],
				Operacao: ['', Validators.maxLength(4)],
				ChavePix: ['', Validators.maxLength(60)],
			}),
		});
	};

	getData = (): void => {
		const datePipe = new DatePipe('en-US');

		if (this.uid == 'new') {
			return;
		}

		this.isLoadingData = true;

		const view = this.supplierService
			.getSupplierById(this.uid)
			?.pipe(first())
			.subscribe((supplier) => {
				this.supplier = supplier;

				const isDate = supplier?.dataNascimento instanceof Date;
				const formattedDate = isDate
					? new Date(supplier?.dataNascimento)
					: null;

				this.prevCepInputValue = supplier?.cep;

				this.registerForm.patchValue({
					clientInfo: {
						CpfCnpj: supplier.cpfCnpj,
						Nome: supplier?.nome,
						razaoSocial: supplier?.nome,
						DataNascimento: formattedDate,
						Telefone: supplier?.telefone,
						Email: supplier?.email,
						tipoFornecedor: supplier.cpfCnpj.length > 11 ? 'cnpj' : 'cpf',
					},
					addressInfo: {
						Cep: supplier?.cep,
						Endereco: supplier?.endereco,
						Bairro: supplier?.bairro,
						Cidade: supplier?.cidade,
						Estado: supplier?.estado,
					},
					bankInfo: {
						IdBanco: supplier?.dadoBancario?.idBanco,
						Agencia: supplier?.dadoBancario?.agencia,
						Conta: supplier?.dadoBancario?.conta,
						Operacao: supplier?.dadoBancario?.operacao,
						ChavePix: supplier?.dadoBancario?.chavePix,
					},
				});

				this.registerForm.markAllAsTouched();
				this.supplierTypeChange();

				this.stepList = [
					{
						label: 'Informações do fornecedor',
						isCurrent: true,
						isVisited: true,
					},
					{
						label: 'Endereço',
						isVisited: true,
					},
					{
						label: 'Dados bancários',
						isVisited: true,
					},
				];

				this.isLoadingData = false;
			});
	};

	getBanks = (): void => {
		this.dominiosService.getBanks().subscribe({
			next: (response: any) => {
				if (response.success) {
					response?.data.forEach((bank: any) => {
						this.dropDownBankList.push({
							label: bank.descricao,
							value: bank.id,
						});
					});
				}
			},
			error: (error: any) => {
				console.error(error);
			},
		});
	};

	onSubmit = (e: any = null): void => {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		let dataNascimento = null;
		if (this.registerForm.value.clientInfo.tipoFornecedor === 'cpf') {
			dataNascimento: this.registerForm.value.clientInfo.DataNascimento != ''
				? new Date(
						this.registerForm.value.clientInfo.DataNascimento?.getTime() -
							this.registerForm.value.clientInfo.DataNascimento?.getTimezoneOffset() *
								60 *
								1000
				  )
				: null;
		}

		const dataContactNascimento =
			this.linkedContact?.dataNascimento != null ||
			this.linkedContact?.dataNascimento != undefined
				? new Date(
						this.linkedContact?.dataNascimento?.getTime() -
							this.linkedContact?.dataNascimento?.getTimezoneOffset() *
								60 *
								1000
				  )
				: null;

		const data: any = {
			CpfCnpj: this.registerForm.value.clientInfo.CpfCnpj,
			Nome: this.registerForm.value.clientInfo.Nome,
			DataNascimento: dataNascimento,
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
			DadosBancarios: {
				GuidReferencia: this.uid != 'new' ? this.uid : null,
				IdBanco: this.bankInfoForm.value.IdBanco,
				Agencia: this.bankInfoForm.value.Agencia,
				Conta: this.bankInfoForm.value.Conta,
				Operacao: this.bankInfoForm.value.Operacao,
				ChavePix: this.bankInfoForm.value.ChavePix,
			},
		};

		if (
			this.registerForm.value.clientInfo.tipoFornecedor === 'cnpj' &&
			this.linkedContact
		) {
			data.Contato = {
				idFornecedor: null,
				nome: this.linkedContact.nome,
				email: this.linkedContact.email,
				telefone: this.linkedContact.telefone,
				cargo: this.linkedContact.cargo,
				dataNascimento: dataContactNascimento,
			};
		}

		if (this.operacaoClonar) {
			this.supplierService.createSupplier(data).subscribe({
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
			this.supplierService.createSupplier(data).subscribe({
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
			this.supplierService.updateSupplier(this.uid, data).subscribe({
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
	};

	goBack = (): void => {
		this.location.back();
	};

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
	};

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	changeStepCb = (step: number): void => {
		if (this.stepList[step - 1].isVisited || step < this.currentStep)
			this.changeStep(step);
	};

	changeStep = (step: number): void => {
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
				stepData.isValid = this.supplierInfoForm.valid ? true : false;
			}

			if (stepListIndex === 2) {
				stepData.isValid = this.addressInfoForm.valid ? true : false;
			}

			if (stepListIndex === 3) {
				stepData.isValid = this.bankInfoForm.valid ? true : false;
			}

			if (step === stepListIndex) {
				stepData.isCurrent = true;
			}
			return stepData;
		});

		this.currentStep = step;
	};

	prevStep = (): void => {
		if (this.currentStep > 1) this.changeStep(this.currentStep - 1);
		else this.goBack();
	};

	nextStep = (): void => {
		const currStep = this.currentStep;

		if (currStep === 1 && this.supplierInfoForm.invalid) {
			this.supplierInfoForm.markAllAsTouched();
			return;
		}

		if (currStep === 2 && this.addressInfoForm.invalid) {
			this.supplierInfoForm.markAllAsTouched();
			return;
		}

		if (currStep === 3) {
			this.onSubmit();
		}

		if (this.currentStep < this.stepList.length)
			this.changeStep(this.currentStep + 1);
	};

	supplierTypeChange = (): void => {
		if (!this.isCnpj) {
			this.supplierInfoForm.controls['CpfCnpj'].setValidators([
				Validators.required,
				CpfValidator,
			]);
			this.supplierInfoForm.controls['DataNascimento'].setValidators([
				PastDateValidator,
			]);
		} else {
			this.supplierInfoForm.controls['CpfCnpj'].setValidators([
				Validators.required,
				CnpjValidator,
			]);
			this.supplierInfoForm.controls['DataNascimento'].removeValidators([
				PastDateValidator,
			]);
		}
		this.supplierInfoForm.controls['CpfCnpj'].updateValueAndValidity();
		this.supplierInfoForm.controls['DataNascimento'].updateValueAndValidity();
	};

	resetLinkedContact = (): void => {
		this.linkedContact = null;
	};

	showContactRegister = (): void => {
		this.contactRegisterVisible = true;
	};

	hideContactRegister = () => {
		this.contactRegisterVisible = false;
	};

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

	setAddressByCEP = (e: any): void => {
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
	};

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

	openModal = (): void => {
		this.displayModal = true;
	};

	closeModal = (onClose?: Function, ...params: any[]): void => {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	};
}
