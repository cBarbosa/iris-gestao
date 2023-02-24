import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { FornecedorService } from 'src/app/shared/services';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-supplier-listing',
	templateUrl: './supplier-listing.component.html',
	styleUrls: ['./supplier-listing.component.scss'],
})
export class SupplierListingComponent {
	statusOptions = [
		{ label: 'Ativo', status: 'ativo' },
		{ label: 'Inativo', status: 'inativo' },
	];

	totalSupplierCount: number;
	isLoadingSuppliers = false;
	noRestults = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	public suppliersEntries: any[];
	dropdownTipoCliente: any;
	tiposCliente = [
		{
			label: 'Todos os tipos de cliente',
			value: null,
		},
	];

	filterText: string;
	filterType: number;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private supplierService: FornecedorService
	) { };

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;
	};


	loadSuppliersPage(event: LazyLoadEvent):void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.getSuppliersPage(page, this.filterText);
			this.scrollTop();
		}
	};

	getSuppliersPage(page = 1, filter?: string): void {
		this.isLoadingSuppliers = true;
		this.suppliersEntries = [];

		const suppliers = this.supplierService
			.getSuppliers(this.rows, page, filter)
			?.pipe(first())
			.subscribe({
				next: (event: any) => {
					if (event.success === true) {
						this.totalSupplierCount = event.data.totalCount;
						if (this.totalSupplierCount <= 0) this.noRestults = true;
						else this.noRestults = false;

						this.suppliersEntries = event.data.items.map((supplier: any) => {
							// console.log('Cliente >> ', cliente);
							return {
								name: supplier.nome,
								cpf_cnpj: supplier.cpfCnpj,
                                phone: supplier.telefone,
                                email: supplier.email,
								//companyName: supplier.razaoSocial,
								status: 'ativo',
								action: '',
								guidReferencia: supplier.guidReferencia,
							};
						});
					} else {
						this.totalSupplierCount = 0;
						this.noRestults = true;
						this.suppliersEntries = [];
					}
					this.isLoadingSuppliers = false;
				},
				error: () => {
					this.totalSupplierCount = 0;
					this.suppliersEntries = [];
					this.noRestults = true;
					this.isLoadingSuppliers = false;
				},
			});
	}

	filterSuppliers = (e: Event) => {
		console.log(e);

		this.getSuppliersPage(1, this.filterText);
	};

	filterSuppliersDebounce: Function = Utils.debounce(this.filterSuppliers, 1000);

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
