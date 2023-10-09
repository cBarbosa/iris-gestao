import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

import { ClienteService, DominiosService } from 'src/app/shared/services';
import { DropdownItem } from 'src/app/shared/models/types';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-expense-edit',
	templateUrl: './expense-edit.component.html',
	styleUrls: ['./expense-edit.component.scss'],
})
export class ExpenseEditComponent {
	editForm: FormGroup;
	tituloPagar: any;
	expenseGuid: string;
	isLoading = false;
	invalidGuid = false;
	
	isSubmitting = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	onInputDate: Function;
	onBlurDate: Function;

	opcoesLocatario: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	opcoesPlanoContas: DropdownItem[] = [
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
	opcoesNomeLocador: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Administradora',
			value: 1,
		},
	];
	opcoesFormaPagamento: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	imovel = {
		nome: '',
		tipo: 'Edifício corporativo',
		endereco: '',
	};
	
	lstImoveis: [
		{
			guidImovel: string;
			lstUnidades: string[];
		}
	];
	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private expenseService: ExpenseService,
		private dominiosService: DominiosService,
		private clienteService: ClienteService
	) {}

	ngOnInit() {
		const expenseGuid = this.activatedRoute.snapshot.paramMap.get('guid');

		if (expenseGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.expenseGuid = expenseGuid;

		this.editForm = this.fb.group({
			nomeConta: ['', Validators.required],
			numeroTitulo: ['', [Validators.required]],
			planoContas: [null, [Validators.required]],
			creditarPara: [null, [Validators.required]],
			locatario: [null, Validators.required],
			formaPagamento: [null, Validators.required],
			dataVencimento: [null, Validators.required],
			valorTitulo: [null, Validators.required],
			valorPagar: [null, Validators.required],
			impostos: [null, Validators.required],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		let data: any;
		this.expenseService
			.getExpenseByGuid(this.expenseGuid)
			.pipe(first())
			.subscribe((event: any) => {
				if (event) {
					data = event.data[0];
					this.tituloPagar = data;
					console.log(data);

					this.imovel.nome = data.imoveis[0].nome;
					const { rua, bairro, cidade, uf } = data.imoveis[0].imovelEndereco[0];
					this.imovel.endereco = `${rua}, ${bairro}, ${cidade} - ${uf}`;

					this.editForm.patchValue({
						nomeConta: data.nomeTitulo,
						planoContas: +data.tipoTituloPagar?.id ?? null,
						creditarPara: +data.creditoAluguel?.id ?? null,
						locatario: data.cliente?.guidReferencia ?? null,
						formaPagamento: +data.formaPagamento?.id ?? null,
						dataVencimento: data.dataVencimentoPrimeraParcela
							? new Date(data.dataVencimentoPrimeraParcela)
							: null,
						valorTitulo: data.valorTitulo,
						impostos: data.porcentagemTaxaAdministracao  +''
					});

					setTimeout(() => {
						this.editForm.patchValue({
							planoContas: +data.tipoTituloPagar?.id ?? null,
							creditarPara: +data.creditoAluguel?.id ?? null,
							locatario: data.cliente?.guidReferencia ?? null,
							formaPagamento: +data.formaPagamento?.id ?? null,
						});
					}, 40);
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
			});

			
		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe({
				next: (response) => {
					this.opcoesLocatario.push({
						label: '--',
						value: '--',
					});
					response?.data.forEach((forma: any) => {
						this.opcoesLocatario.push({
							label: forma.nome,
							value: forma.guidReferencia,
						});
					});
					this.f['locatario'].setValue(+data.cliente?.guidReferencia ?? null);
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService
			.getTiposTitulo()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesPlanoContas.push(
							...e.data.map((item: any) => {
								return {
									label: item.nome,
									value: item.id,
								};
							})
						);
						this.f['planoContas'].setValue(+data.tipoTituloPagar?.id ?? null);
					} else console.error(e.message);
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
					this.f['creditarPara'].setValue(+data.creditoAluguel?.id ?? null);
				},
				error: (err) => {
					console.error(err);
				},
			});

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
					this.f['formaPagamento'].setValue(+data.formaPagamento?.id ?? null);
				},
				error: (err) => {
					console.error(err);
				},
			});
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: any) {
		let formData: {
			nomeConta: string;
			planoContas: number;
			idTipoCreditoAluguel: number;
			idContratoAluguel: null;
			locatario: string;
			idIndiceReajuste: number | null;
			formaPagamento: number;
			dataVencimento: Date;
			valorTitulo: number;
			impostos: number;
			parcelas: number;
		} = this.editForm.getRawValue();

		const expenseObj: {
			NomeTitulo: string;
			idTipoTitulo: number;
			idTipoCreditoAluguel:  number | null;
			idContratoAluguel: null;
			guidCliente: string | null;
			idIndiceReajuste: number | null;
			idFormaPagamento: number;
			DataVencimentoPrimeraParcela: string;
			valorTitulo: number;
			PorcentagemImpostoRetido: number;
			lstImoveis: [
				{
					guidImovel: string;
					lstUnidades: string[];
				}
			];
		} = {
			NomeTitulo: formData.nomeConta,
			idTipoTitulo: formData.planoContas,
			idTipoCreditoAluguel: null,
			guidCliente: formData.locatario === '--' ? null : formData.locatario,
			idContratoAluguel: null,
			idIndiceReajuste: null,
			idFormaPagamento: formData.formaPagamento,
			DataVencimentoPrimeraParcela: formData.dataVencimento.toISOString(),
			valorTitulo: formData.valorTitulo,
			PorcentagemImpostoRetido: formData.impostos,
			lstImoveis: this.lstImoveis
		};
		console.log('objSubmit >> ' + JSON.stringify(expenseObj));
		this.expenseService
			.updateExpense(this.expenseGuid, expenseObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Edição realizada com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Edição não realizada',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Edição não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

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

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
