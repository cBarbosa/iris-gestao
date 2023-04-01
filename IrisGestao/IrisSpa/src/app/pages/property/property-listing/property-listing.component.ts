import { Component, OnInit } from '@angular/core';
import {
	ActivatedRoute,
	Event,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router,
} from '@angular/router';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { first } from 'rxjs';
import { IImovel, Imovel } from 'src/app/shared/models';
import {
	ImovelService,
	ClienteService,
	CommonService,
} from 'src/app/shared/services';
import { AnexoService } from 'src/app/shared/services/anexo.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-property-listing',
	templateUrl: './property-listing.component.html',
	styleUrls: ['./property-listing.component.scss'],
})
export class PropertyListingComponent implements OnInit {
	properties: IImovel[] = [];

	totalListCount: number;
	isLoadingList = true;
	showPaginator = false;
	noRestults = false;

	first = 0;
	rows = 10;
	pageCount = 1;
	pageIndex = 1;

	filterText: string;
	filterCategory: number;
	filterProprietary: number;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;

	proprietaryOptions: {
		label: string;
		value: string | null;
	}[] = [{ label: 'Todos os proprietários', value: null }];

	categoryOptions: {
		label: string;
		value: string | null;
	}[] = [{ label: 'Todos os tipos de imóveis', value: null }];

	constructor(
		private imovelService: ImovelService,
		private clienteService: ClienteService,
		private commonService: CommonService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit(): void {
		// 	const routePageIndex =
		// 		this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		// 	this.pageIndex = +routePageIndex;
		// 	console.log('pageIndex', this.pageIndex);
		// this.getPagingData(this.pageIndex);

		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		this.getPagingData(this.pageIndex);

		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationStart) {
				// Show loading indicator
			}

			if (event instanceof NavigationEnd) {
				// Hide loading indicator

				const routePageIndex =
					this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
				this.pageIndex = +routePageIndex;

				this.getPagingData(this.pageIndex);
			}

			if (event instanceof NavigationError) {
				// Hide loading indicator

				// Present error to user
				console.error(event.error);
			}
		});

		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.proprietaryOptions.push(
							...e.data.map((item: any) => {
								return {
									label: this.truncateChar(item.nome),
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
			.getUnitType()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.categoryOptions.push(
							...e.data.map((item: any) => {
								return {
									label: this.truncateChar(item.nome),
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

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});
	}

	loadClientsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			this.isLoadingList = true;
			const page = Math.floor(event.first / this.rows) + 1;
			this.getPagingData(page);
		}
	}

	getPagingData(
		page: number = 1,
		filter?: string,
		categoryId?: number,
		proprietaryId?: number
	): void {
		this.isLoadingList = true;
		const list = this.imovelService
			.getProperties(this.rows, page, filter, categoryId, proprietaryId)
			?.pipe(first())
			.subscribe((event: any) => {
				if (event.success) {
					this.properties = [];
					this.totalListCount = event.data.totalCount;
					this.pageCount = Math.floor(event.data.totalCount / this.rows);
					this.showPaginator =
						this.pageCount > 1 || this.pageIndex > this.pageCount;

					this.properties = event.data.items;

					if (event.data.items.length > 0) this.noRestults = false;
					else this.noRestults = true;
				} else {
					this.showPaginator = true;
					this.pageCount = 1;
					this.totalListCount = 0;
					this.properties = [];
					this.noRestults = true;
				}
				this.isLoadingList = false;
			});
	}

	filterProperties = (e: Event) => {
		this.getPagingData(
			1,
			this.filterText,
			this.filterCategory,
			this.filterProprietary
		);
	};

	filterPropertiesDebounce: Function = Utils.debounce(
		this.filterProperties,
		1000
	);

	paginate = ({
		first,
		rows,
		page,
		pageCount,
	}: {
		first: number;
		rows: number;
		page: number;
		pageCount: number;
	}) => {
		//event.first = Index of the first record
		//event.rows = Number of rows to display in new page
		//event.page = Index of the new page
		//event.pageCount = Total number of pages

		this.router.navigate([`property/listing/${page + 1}`]);
		// this.pageIndex = page;
		// this.getPagingData(page + 1);
	};

	openFilters() {
		this.displayMobileFilters = true;
	}

	closeFilters() {
		this.displayMobileFilters = false;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	truncateChar(text: string): string {
		const charlimit = 48;
		if (!text || text.length <= charlimit) {
			return text;
		}

		const without_html = text.replace(/<(?:.|\n)*?>/gm, '');
		const shortened = without_html.substring(0, charlimit) + '...';
		return shortened;
	}
}
