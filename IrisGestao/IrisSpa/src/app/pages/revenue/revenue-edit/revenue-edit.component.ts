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
import { RevenueService } from 'src/app/shared/services/revenue.service';
import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-revenue-edit',
	templateUrl: './revenue-edit.component.html',
	styleUrls: ['./revenue-edit.component.scss'],
})
export class RevenueEditComponent {
	editForm: FormGroup;

	revenueGuid: string;
	revenue: any;
	isLoading = false;
	invalidGuid = false;

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
	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private revenueService: RevenueService,
		private dominiosService: DominiosService,
		private clienteService: ClienteService
	) {}

	ngOnInit() {
		const revenueGuid = this.activatedRoute.snapshot.paramMap.get('guid');

		if (revenueGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.revenueGuid = revenueGuid;

		this.editForm = this.fb.group({
			nomeConta: ['', Validators.required],
			numeroTitulo: ['', [Validators.required]],
			planoContas: [null, [Validators.required]],
			creditarPara: [null, [Validators.required]],
			nomeLocador: [null, Validators.required],
			formaPagamento: [null, Validators.required],
			dataVencimento: [null, Validators.required],
			valorTitulo: [null, Validators.required],
			valorPagar: [null, Validators.required],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.revenueService
			.getRevenueByGuid(this.revenueGuid)
			.subscribe((event: any) => {
				if (event) {
					const data = event.data[0];
					console.log(data);

					this.revenue = data;

					this.imovel.nome = data.imoveis[0].nome;
					const { rua, bairro, cidade, uf } = data.imoveis[0].imovelEndereco[0];
					this.imovel.endereco = `${rua}, ${bairro}, ${cidade} - ${uf}`;

					this.editForm.patchValue({
						nomeConta: data.nomeTitulo,
						numeroTitulo: data.numeroTitulo,
						planoContas: +data.tipoTituloReceber?.id ?? null,
						creditarPara: +data.creditoAluguel?.id ?? null,
						nomeLocador: data.cliente.guidReferencia ?? null,
						formaPagamento: +data.formaPagamento?.id ?? null,
						dataVencimento: data.dataVencimentoPrimeraParcela
							? new Date(data.dataVencimentoPrimeraParcela)
							: null,
						valorTitulo: data.valorTitulo,
						valorPagar: data.valorTitulo,
					});

					// this.editForm = this.fb.group({
					// 	nomeConta: [data.nomeTitulo, Validators.required],
					// 	numeroTitulo: [data.numeroTitulo, [Validators.required]],
					// 	planoContas: [
					// 		+data.tipoTituloReceber.id ?? null,
					// 		[Validators.required],
					// 	],
					// 	creditarPara: [
					// 		+data.creditoAluguel.id ?? null,
					// 		[Validators.required],
					// 	],
					// 	nomeLocador: [data.cliente.nome ?? null, Validators.required],
					// 	formaPagamento: [
					// 		+data.formaPagamento.id ?? null,
					// 		Validators.required,
					// 	],
					// 	dataVencimento: [
					// 		data.dataVencimentoPrimeraParcela
					// 			? new Date(data.dataVencimentoPrimeraParcela)
					// 			: null,
					// 		Validators.required,
					// 	],
					// 	valorTitulo: [data.valorTitulo, Validators.required],
					// 	valorPagar: [data.valorTitulo, Validators.required],
					// });

					// setTimeout(() => {
					// 	this.editForm.patchValue({
					// 		planoContas: +data.tipoTituloReceber?.id ?? null,
					// 		creditarPara: +data.creditoAluguel?.id ?? null,
					// 		nomeLocador: data.cliente?.nome ?? null,
					// 		formaPagamento: +data.formaPagamento?.id ?? null,
					// 	});
					// }, 40);
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
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
						this.f['planoContas'].setValue(
							+this.revenue?.tipoTituloReceber?.id ?? null
						);
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
					this.f['creditarPara'].setValue(
						+this.revenue?.creditoAluguel?.id ?? null
					);
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
					this.f['formaPagamento'].setValue(
						+this.revenue?.formaPagamento?.id ?? null
					);
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
						this.opcoesNomeLocador.push({
							label: forma.nome,
							value: forma.guidReferencia,
						});
					});
					this.f['nomeLocador'].setValue(this.revenue?.cliente.guidReferencia);
					console.log('>>>>>>>>>', this.revenue?.cliente.guidReferencia);
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

	onSubmit(e: Event) {}

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
