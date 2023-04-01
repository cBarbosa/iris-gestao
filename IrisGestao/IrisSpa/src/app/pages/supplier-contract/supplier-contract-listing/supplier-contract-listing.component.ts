import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { CommonService } from 'src/app/shared/services';
import {
	AnexoService,
	ArquivoClassificacoes,
} from 'src/app/shared/services/anexo.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { SupplierContractService } from 'src/app/shared/services/supplier-contract.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-supplier-contract-listing',
	templateUrl: './supplier-contract-listing.component.html',
	styleUrls: ['./supplier-contract-listing.component.scss'],
})
export class SupplierContractListingComponent {
	totalContractCount: number;
	isLoadingContracts = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	noRestults = false;
	contractEntries: any[] = [];

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	cardPipes: Record<string, PipeTransform>;

	tableMenu: MenuItem[];
	focusedContract: any;

	tiposFornecedor = [
		{
			label: 'Tipo de fornecedor',
			value: null,
		},
	];

	filterText: string = '';
	filterType: number;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private contractService: SupplierContractService,
		private commonService: CommonService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		if (this.isMobile) this.setContractsEntries();

		this.cardPipes = {
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
			currency: new CurrencyPipe('pt-BR', 'R$'),
		};
	}

	loadContractsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			// this.getContractPage(page, this.filterText);
			this.filterContracts(undefined, page);
			this.scrollTop();
		}
	}

	setContractsEntries(
		page = 1,
		numeroContrato?: number,
		idTipoFornecedor?: number
	): Promise<any> {
		this.contractEntries = [];

		return this.getContractPage(page, numeroContrato, idTipoFornecedor)
			.then((content) => {
				this.totalContractCount = content.totalCount;
				if (this.totalContractCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.contractEntries = content.data;
			})
			.catch((err) => {
				this.totalContractCount = 0;
				this.noRestults = true;
			});
	}

	loadContractEntries(): void {
		const page = Math.ceil(this.contractEntries.length / this.rows) + 1;

		this.filterContracts(undefined, page, true)
			.then((content) => {
				this.totalContractCount = content.totalCount;
				if (this.totalContractCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.contractEntries = [...this.contractEntries, ...content.data];
			})
			.catch((err) => {
				this.totalContractCount = 0;
				this.noRestults = true;
			});
	}

	getContractPage(
		page = 1,
		numeroContrato?: number,
		idTipoFornecedor?: number
	): Promise<any> {
		this.isLoadingContracts = true;

		return new Promise((res, rej) => {
			this.contractService
				.getContracts(this.rows, page, idTipoFornecedor, numeroContrato)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							console.log('fornecedores', event.data);

							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((contrato: any) => {
									return {
										numeroContrato: contrato.descricaoServico,
										prestador: contrato.fornecedor.nome,
										cpfCnpj: contrato.fornecedor.cpfCnpj,
										dataInicioContrato: contrato.dataInicioContrato
											? new Date(contrato.dataInicioContrato)
											: null,
										dataFimContrato: contrato.dataFimContrato
											? new Date(contrato.dataFimContrato)
											: null,
										valorServico: contrato.valorServicoContratado,
										action: '',
										guidReferencia: contrato.guidReferencia,
									};
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingContracts = false;
					},
					error: () => {
						rej(null);
						this.isLoadingContracts = false;
					},
				});
		});
	}

	filterContracts = (e?: Event, page: number = 1, stack: boolean = false) => {
		if (stack)
			return this.getContractPage(page, +this.filterText, this.filterType);
		else
			return this.setContractsEntries(page, +this.filterText, this.filterType);
	};

	filterContractsDebounce: Function = Utils.debounce(
		this.filterContracts,
		1000
	);

	openFilters() {
		this.displayMobileFilters = true;
	}

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
