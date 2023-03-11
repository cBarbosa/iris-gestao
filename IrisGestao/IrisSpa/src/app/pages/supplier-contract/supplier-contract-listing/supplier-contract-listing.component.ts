import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { CommonService } from 'src/app/shared/services';
import { AnexoService, ArquivoClassificacoes } from 'src/app/shared/services/anexo.service';
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
		private commonService: CommonService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;
	}

	loadContractsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			// this.getContractPage(page, this.filterText);
			this.filterContracts();
			this.scrollTop();
		}
	}

	getContractPage(
		page = 1,
		numeroContrato?: number,
		idTipoFornecedor?: number
	): void {
		this.isLoadingContracts = true;

		const contracts = this.contractService
			.getContracts(this.rows, page, idTipoFornecedor, numeroContrato)
			?.pipe(first())
			.subscribe({
				next: (event: any) => {
					if (event.success === true) {
						this.totalContractCount = event.data.totalCount;
						if (this.totalContractCount <= 0) this.noRestults = true;
						else this.noRestults = false;

						console.log('fornecedores', event.data);

						this.contractEntries = event.data.items.map((contrato: any) => {
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
						});
					} else {
						this.totalContractCount = 0;
						// this.noRestults = true;
						// this.contractEntries = [];
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
	}

	filterContracts = (e?: Event) => {
		this.getContractPage(1, +this.filterText, this.filterType);
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
