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
import { ContratoFornecedor } from 'src/app/shared/models/contrato-fornecedor.model';
import {
	CommonService,
	DominiosService,
	ImovelService,
} from 'src/app/shared/services';
import { SupplierContractService } from 'src/app/shared/services/supplier-contract.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { Utils } from 'src/app/shared/utils';
import {
	CnpjValidator,
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

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
	[label: string]: any;
};

@Component({
	selector: 'app-supplier-contract-register',
	templateUrl: './supplier-contract-register.component.html',
	styleUrls: ['./supplier-contract-register.component.scss'],
})
export class SupplierContractRegisterComponent {
	registerForm: FormGroup;
	registerSupplierForm: FormGroup;

	registerSupplierVisible = false;

	stepList: Step[];
	currentStep: number;

	onInputDate: Function;
	onBlurDate: Function;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	suppliers: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	dueDates: DropdownItem[] = Array.from({ length: 31 }, (v, k) => {
		return { label: 'Todo dia ' + (k + 1), value: k + 1, disabled: false };
	});

	paymentTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	readjustmentIndexes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	/* \/ quais opções ????? FIX*/
	readjustmentFrequencies: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'A cada ano',
			value: 1,
		},
	];

	buildings: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	supplierTypes: DropdownItem[] = [
		{
			label: 'Pessoa física',
			value: 'cpf',
		},
		{
			label: 'Pessoa Jurídica',
			value: 'cnpj',
		},
	];

	attachments: {
		projeto?: File;
		matricula?: File;
		habitese?: File;
	} = {};

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private contractService: SupplierContractService,
		private supplierService: SupplierService,
		private dominiosService: DominiosService,
		private commonService: CommonService,
		private imovelService: ImovelService
	) {}

	ngOnInit() {
		this.currentStep = 3;

		this.stepList = [
			{
				label: 'Informações do local',
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

		this.registerForm = this.fb.group({
			contractInfo: this.fb.group({
				nome: ['', Validators.required],
				numero: ['', Validators.required],
				prestador: [null, Validators.required],
				imovel: [null, Validators.required],
			}),
			valuesInfo: this.fb.group({
				valor: ['', Validators.required],
				dataInicio: [null, Validators.required],
				dataFim: [null, Validators.required],
				dataVencimento: [1, Validators.required],
				pagamento: [null, Validators.required],
				reajuste: [null, Validators.required],
				periodicidade: [null, Validators.required],
				percentual: [null, Validators.required],
			}),
		});

		this.registerSupplierForm = this.fb.group({
			tipoFornecedor: ['cpf', [Validators.required]],
			cpfCnpj: ['', [Validators.required]],
			nome: ['', [Validators.required]],
			razaoSocial: ['', [Validators.required]],
			endereco: ['', [Validators.required]],
			bairro: ['', [Validators.required]],
			cidade: ['', [Validators.required]],
			estado: ['', [Validators.required]],
			cep: ['', [Validators.required]],
			email: ['', [Validators.required, EmailValidator]],
			telefone: ['', [Validators.required]],

			contato: this.fb.group({
				nome: ['', []],
				email: ['', [EmailValidator]],
				telefone: ['', []],
				cargo: ['', []],
				dataNascimento: ['', []],
			}),
			dadosBancarios: this.fb.group({
				agencia: [null, [Validators.required]],
				operacao: [null, [Validators.required]],
				conta: [null, [Validators.required]],
				banco: ['', [Validators.required]],
				chavePix: ['', [Validators.required]],
			}),
		});

		/*
		{
    "cpfCnpj": "55642822000168",
    "nome": "Segurança Patrimonial",
    "razaoSocial": "Segurança Patrimonial LTDA",
    "endereco": "Quadra SQN 115",
    "bairro": "Asa Norte",
    "cidade": "Brasília",
    "estado": "DF",
    "cep": 70772000,
    "email": "renato.s.almeida@outlook.com",
    "telefone": "61991363588",
    "contato": {
        "nome": "Segurança Patrimonial ",
        "email": "renato.s.almeida@outlook.com",
        "telefone": "61991363588",
        "cargo": "Executivo",
        "dataNascimento": "1988-04-26"
    },
    "dadosBancarios": {
        "agencia": 1041,
        "operacao": 1,
        "conta": 22630,
        "banco": "Caixa Economica Federal",
        "chavePix": "61991363588"
    }
}
 */

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.getListaFornecedores();
		this.getFormasPagamento();
		this.getIndicesReajuste();

		this.imovelService.getProperties(100, 1).subscribe((event) => {
			if (event) {
				event.data.items.forEach((item: any) => {
					this.buildings.push({
						label: item.nome,
						value: {
							guid: item.guidReferencia,
							name: item.nome,
						},
						units: item.unidade,
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

	getListaFornecedores() {
		this.supplierService
			.getSuppliers(100)
			.pipe(first())
			.subscribe((event) => {
				if (event) {
					this.suppliers = [
						{
							label: 'Selecione',
							value: null,
							disabled: true,
						},
					];
					event.data.items.forEach((item: any) => {
						this.suppliers.push({
							label: item.nome,
							value: item.guidReferencia,
						});
					});
				}
			});
	}

	getFormasPagamento() {
		this.dominiosService
			.getFormasPagamento()
			.pipe(first())
			.subscribe((event) => {
				if (event) {
					this.paymentTypes = [
						{
							label: 'Selecione',
							value: null,
							disabled: true,
						},
					];
					event.data.forEach((item: any) => {
						this.paymentTypes.push({
							label: item.nome,
							value: item.id,
						});
					});
				}
			});
	}

	getIndicesReajuste() {
		this.commonService
			.getReadjustment()
			.pipe(first())
			.subscribe((event) => {
				if (event) {
					this.readjustmentIndexes = [
						{
							label: 'Selecione',
							value: null,
							disabled: true,
						},
					];
					event.data.forEach((item: any) => {
						this.readjustmentIndexes.push({
							label: item.nome,
							value: item.id,
						});
					});
				}
			});
	}

	setNewSupplier: () => void = () => {};

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
			this.contractInfoForm.updateValueAndValidity();
			if (this.contractInfoForm.invalid) {
				this.contractInfoForm.markAllAsTouched();
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

	onSelect(e: any, classificacao: 'projeto' | 'matricula' | 'habitese') {
		console.log('e', e);
		this.attachments[classificacao] = e.currentFiles[0];
	}

	onSubmit(e: any = null) {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		let formData: {
			contractInfo: {
				nome: string; //x
				numero: string; //x
				prestador: string; //x
				imovel: string; //x
			};
			valuesInfo: {
				valor: number; //x
				dataInicio: string; //x
				dataFim: string; //x
				dataVencimento: number; //x
				pagamento: number; //x
				reajuste: number; //x
				periodicidade: number; //x
				percentual: number;
			};
		} = this.registerForm.getRawValue();

		// 		{
		//     "guidImovel": "05ca9f97-5a0c-45be-b02c-91184f4769f6",
		//     "guidFornecedor": "7f60724d-5601-4ac8-8aa1-588f88457ac8",
		//     "idFormaPagamento": 2,
		//     "idIndiceReajuste": 1,
		//     "numeroContrato": "123456/2023",
		//     "descricaoDoServico": "Serviço de limpeza",
		//     "percentual": 10,
		//     "dataAtualizacao": "2023-02-10T03:00:12.252Z",
		//     "valorServicoContratado": 220000,
		//     "dataInicioContrato": "2023-02-10T03:00:12.252Z",
		//     "dataFimContrato": "2024-02-10T03:00:12.252Z",
		//     "diaPagamento": 26,
		//     "periodicidadeReajuste": 12
		// }

		console.log('formData', formData);

		const contractObj: {
			guidImovel: string;
			guidFornecedor: string;
			idFormaPagamento: number;
			idIndiceReajuste: number;
			numeroContrato: string;
			descricaoDoServico: string;
			percentual: number;
			dataAtualizacao: string;
			valorServicoContratado: number;
			dataInicioContrato: string;
			dataFimContrato: string;
			diaPagamento: number;
			periodicidadeReajuste: number;
		} = {
			guidImovel: formData.contractInfo.imovel,
			guidFornecedor: formData.contractInfo.prestador,
			idFormaPagamento: formData.valuesInfo.pagamento,
			idIndiceReajuste: formData.valuesInfo.reajuste,
			numeroContrato: formData.contractInfo.numero,
			descricaoDoServico: formData.contractInfo.nome,
			/* \/ o que é percentual ????? FIX */
			percentual: formData.valuesInfo.percentual,
			dataAtualizacao: new Date().toISOString(),
			valorServicoContratado: formData.valuesInfo.valor,
			dataInicioContrato: formData.valuesInfo.dataInicio,
			dataFimContrato: formData.valuesInfo.dataFim,
			diaPagamento: formData.valuesInfo.dataVencimento,
			periodicidadeReajuste: formData.valuesInfo.periodicidade,
		};

		const filesObj = {
			projeto: this.attachments.projeto,
			matricula: this.attachments.matricula,
			habitese: this.attachments.habitese,
		};

		console.log('files', filesObj);
		/** 
		this.contractService
			.registerContract(contractObj)
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
			});*/
	}

	supplierTypeChange(e: any) {
		const isCpf = e.value;
		if (!isCpf) {
			this.registerSupplierForm.controls['CpfCnpj'].setValidators([
				Validators.required,
				CpfValidator,
			]);
			this.registerSupplierForm.controls['DataNascimento'].setValidators([
				PastDateValidator,
			]);
		} else {
			this.registerSupplierForm.controls['CpfCnpj'].setValidators([
				Validators.required,
				CnpjValidator,
			]);
			this.registerSupplierForm.controls['DataNascimento'].removeValidators([
				PastDateValidator,
			]);
		}
		this.registerSupplierForm.controls['CpfCnpj'].updateValueAndValidity();
		this.registerSupplierForm.controls[
			'DataNascimento'
		].updateValueAndValidity();
	}

	onSupplierSubmit() {
		if (this.registerSupplierForm.invalid) {
			this.registerSupplierForm.markAllAsTouched();
			return;
		}

		const renterFormData = this.registerSupplierForm.getRawValue();
		console.log(renterFormData);

		const renterObj = {
			nome: renterFormData.name,
			cpfCnpj: renterFormData.cpfCnpj.toString(),
			dataNascimento: (renterFormData.birthday as Date).toISOString(),
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

		// this.supplierService
		// 	.registerSupplier(renterObj)
		// 	.pipe(first())
		// 	.subscribe({
		// 		next: (response: any) => {
		// 			if (response.success) {
		// 				this.modalContent = {
		// 					header: 'Cadastro realizado',
		// 					message:
		// 						response.message ??
		// 						'Cadastro de proprietário realizado com sucesso',
		// 					isError: false,
		// 				};

		// 				this.registerSupplierForm.reset();

		// 				this.getListaFornecedores();

		// 				console.log('resp', response.data);

		// 				this.setNewSupplier = () => {
		// 					this.contractInfoForm.controls['locatario'].setValue(
		// 						response.data.guidReferencia
		// 					);
		// 				};

		// 				// this.registerRenterVisible = false;
		// 				this.openModal();
		// 			} else {
		// 				this.modalContent = {
		// 					header: 'Cadastro não realizado',
		// 					message:
		// 						response.message ?? 'Erro no envio de dados de proprietário',
		// 					isError: true,
		// 				};

		// 				this.registerSupplierVisible = false;
		// 				this.openModal();
		// 			}
		// 		},
		// 		error: (error: any) => {
		// 			console.error(error);
		// 			this.modalContent = {
		// 				header: 'Cadastro não realizado',
		// 				message: 'Erro no envio de dados de proprietário',
		// 				isError: true,
		// 			};

		// 			this.registerSupplierVisible = false;
		// 			this.openModal();
		// 		},
		// 	});
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
