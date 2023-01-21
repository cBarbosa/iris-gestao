import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { CommonService } from 'src/app/shared/services';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-rent-contract-listing',
	templateUrl: './rent-contract-listing.component.html',
	styleUrls: ['./rent-contract-listing.component.scss'],
})
export class RentContractListingComponent {
	totalContractCount: number;
	isLoadingContracts = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	noRestults = false;
	contractEntries: any[];

	tableMenu: MenuItem[];
	focusedContract: any;

	basesReajuste = [
		{
			label: 'Base de reajuste',
			value: null,
		},
	];
	tiposImovel = [
		{
			label: 'Tipo de imóvel',
			value: null,
		},
	];
	vencimentos = [
		{
			label: 'Vencimento',
			value: null,
		},
		{
			label: 'Hoje',
			value: null,
		},
		{
			label: 'Esta semana',
			value: null,
		},
		{
			label: 'Este mês',
			value: null,
		},
		{
			label: 'Este ano',
			value: null,
		},
		{
			label: 'Próximo ano',
			value: null,
		},
	];

	filterText: string;
	filterBase: number;
	filterType: number;
	filterDue: number;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private contractService: RentContractService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		this.tableMenu = [
			{
				label: 'Detalhes',
				icon: 'ph-eye',
				command: () => this.navigateTo('rent-contract/details'),
			},
			{
				label: 'Editar',
				icon: 'ph-note-pencil',
				command: () => this.navigateTo('rent-contract/edit/'),
			},
			{
				label: 'Duplicar',
				icon: 'ph-copy-simple',
				// command: () => this.cloneUnit(this.unit!.guidReferencia!),
			},
		];

		this.commonService
			.getUnitType()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.tiposImovel.push(
							...e.data.map((item: any) => {
								return {
									label: item.nome,
									value: item.id,
								};
							})
						);
					} else console.error(e.message);
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.commonService
			.getReadjustment()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.basesReajuste.push(
							...e.data.map((item: any) => {
								return {
									label: item.nome,
									value: item.id,
								};
							})
						);
					} else console.error(e.message);
				},
				error: (err) => {
					console.error(err);
				},
			});
	}

	loadContractsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.getContractPage(page, this.filterText);
			this.scrollTop();
		}
	}

	getContractPage(page = 1, filter?: string, typeId?: number): void {
		this.isLoadingContracts = true;
		this.contractEntries = [
			{
				name: 'SICOOB',
				unit: 'Sala comercial',
				contractStart: new Date('2021-01-21').toLocaleDateString(),
				nextReadjustment: new Date('2023-01-21').toLocaleDateString(),
				contractDue: new Date('2018-09-06').toLocaleDateString(),
				readjustmentBase: 'IGPM',
				action: '',
				guidReferencia: 'id',
			},
		];

		this.isLoadingContracts = false;
		/*
		const contracts = this.contractService
			.getContracts(this.rows, page, undefined, filter, typeId)
			?.pipe(first())
			.subscribe({
				next: (event: any) => {
					if (event.success === true) {
						this.totalContractCount = event.data.totalCount;
						if (this.totalContractCount <= 0) this.noRestults = true;
						else this.noRestults = false;

						this.contractEntries = event.data.items.map((contrato: any) => {
							return {
								name: contrato.nome,
								cpf_cnpj: contrato.cpfCnpj,
								birthday: contrato.dataNascimento
									? new Date(contrato.dataNascimento)
									: new Date(),
								// client_type: cliente.idTipoClienteNavigation.nome,
								status: 'ativo',
								action: '',
								guidReferencia: contrato.guidReferencia,
							};
						});
					} else {
						this.totalContractCount = 0;
						this.noRestults = true;
						this.contractEntries = [];
					}
					this.isLoadingContracts = false;
				},
				error: () => {
					this.totalContractCount = 0;
					this.contractEntries = [];
					this.noRestults = true;
					this.isLoadingContracts = false;
				},
			});
			*/
	}

	filterContracts = (e: Event) => {
		console.log(e);

		this.getContractPage(1, this.filterText, this.filterType);
	};

	filterContractsDebounce: Function = Utils.debounce(
		this.filterContracts,
		1000
	);

	setCurrentContract(item: any): void {
		this.focusedContract = item;
	}

	scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
