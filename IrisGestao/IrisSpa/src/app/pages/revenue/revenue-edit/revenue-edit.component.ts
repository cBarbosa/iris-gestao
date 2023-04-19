import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
		{
			label: 'IPTU',
			value: 1,
		},
	];
	opcoesCreditarPara: DropdownItem[] = [
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
		{
			label: 'Boleto',
			value: 1,
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
		private revenueService: RevenueService
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

					this.imovel.nome = data.imoveis[0].nome;
					const { rua, bairro, cidade, uf } = data.imoveis[0].imovelEndereco[0];
					this.imovel.endereco = `${rua}, ${bairro}, ${cidade} - ${uf}`;

					this.editForm.patchValue({
						nomeConta: data.nomeTitulo,
						numeroTitulo: data.numeroTitulo,
						planoContas: data.tipoTituloReceber.id,
						creditarPara: data.creditoAluguel.id,
						nomeLocador: data.cliente.nome,
						formaPagamento: data.formaPagamento.id,
						dataVencimento: data.dataVencimentoPrimeraParcela
							? new Date(data.dataVencimentoPrimeraParcela)
							: null,
						valorTitulo: data.valorTitulo,
						valorPagar: data.valorTitulo,
					});
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
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
