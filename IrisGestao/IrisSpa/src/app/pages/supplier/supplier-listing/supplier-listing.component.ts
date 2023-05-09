import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { CpfCnpjPipe } from 'src/app/shared/pipes/cpf-cnpj.pipe';
import { TelefonePipe } from 'src/app/shared/pipes/telefone.pipe';
import { FornecedorService } from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
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
	isLoadingSuppliers = true;
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

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	cardPipes: Record<string, PipeTransform>;

	filterText: string;
	filterType: number;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private supplierService: FornecedorService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		if (this.isMobile) this.setSuppliersEntries();

		this.cardPipes = {
			cpfcnpj: new CpfCnpjPipe(),
			telefone: new TelefonePipe(),
		};
	}

	loadSuppliersPage(event: LazyLoadEvent): void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.filterSuppliers(undefined, page);
			this.scrollTop();
		}
	}

	setSuppliersEntries(page = 1, filter?: string): Promise<any> {
		this.suppliersEntries = [];

		return this.getSuppliersPage(page, filter)
			.then((content) => {
				this.totalSupplierCount = content.totalCount;
				if (this.totalSupplierCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.suppliersEntries = content.data;
			})
			.catch((err) => {
				this.totalSupplierCount = 0;
				this.noRestults = true;
			});
	}

	loadSuppliersEntries(): void {
		const page = Math.ceil(this.suppliersEntries.length / this.rows) + 1;

		this.filterSuppliers(undefined, page, true)
			.then((content) => {
				this.totalSupplierCount = content.totalCount;
				if (this.totalSupplierCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.suppliersEntries = [...this.suppliersEntries, ...content.data];
			})
			.catch((err) => {
				this.totalSupplierCount = 0;
				this.noRestults = true;
			});
	}

	getSuppliersPage(page = 1, filter?: string): Promise<any> {
		this.isLoadingSuppliers = true;

		return new Promise((res, rej) => {
			this.supplierService
				.getSuppliers(this.rows, page, filter)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							this.totalSupplierCount = event.data.totalCount;
							if (this.totalSupplierCount <= 0) this.noRestults = true;
							else this.noRestults = false;

							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((supplier: any) => {
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
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingSuppliers = false;
					},
					error: () => {
						rej(null);
						this.isLoadingSuppliers = false;
					},
				});
		});
	}

	filterSuppliers = (e?: Event, page: number = 1, stack: boolean = false) => {
		console.log(e);

		if (stack) return this.getSuppliersPage(page, this.filterText);
		else return this.setSuppliersEntries(page, this.filterText);
	};

	filterSuppliersDebounce: Function = Utils.debounce(
		this.filterSuppliers,
		1000
	);

	openFilters() {
		this.displayMobileFilters = true;
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
