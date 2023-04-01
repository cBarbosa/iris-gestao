import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { first } from 'rxjs';
import { Utils } from 'src/app/shared/utils';
import { LazyLoadEvent } from 'primeng/api';
import { ConstructionService } from 'src/app/shared/services/construcao.service';

@Component({
	selector: 'app-construction-listing',
	templateUrl: './construction-listing.component.html',
	styleUrls: ['./construction-listing.component.scss'],
})
export class ConstructionListingComponent {
	totalConstructionCount: number;
	isLoadingConstructions = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	noRestults = false;
	constructionEntries: any[];

	onInputDate: Function;
	onBlurDate: Function;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	cardPipes: Record<string, PipeTransform>;

	tiposConta = [
		{
			label: 'Tipo de conta',
			value: null,
		},
	];

	tiposImovel = [
		{
			label: 'Tipo de imóvel',
			value: null,
		},
	];

	status = [
		{
			label: 'Status',
			value: null,
		},
	];

	filterText: string = '';
	filterAccountType: number;
	filterPropertyType: number;
	filterStatus: number;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private constructionService: ConstructionService,
		private commonService: CommonService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		if (this.isMobile) this.setConstructionEntries();

		this.cardPipes = {
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
			currency: new CurrencyPipe('pt-BR', 'R$'),
		};

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
	}

	loadConstructionsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			// this.getConstructionPage(page, this.filterText);
			this.filterConstructions(undefined, page);
			this.scrollTop();
		}
	}

	setConstructionEntries(
		page = 1,
		numeroConstrucao?: string,
		idTipoConta?: number,
		idTipoImovel?: number,
		idStatus?: number
	): Promise<any> {
		this.constructionEntries = [];

		return this.getConstructionPage(
			page,
			numeroConstrucao,
			idTipoConta,
			idTipoImovel,
			idStatus
		)
			.then((content) => {
				this.totalConstructionCount = content.totalCount;
				if (this.totalConstructionCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.constructionEntries = content.data;
			})
			.catch((err) => {
				this.totalConstructionCount = 0;
				this.noRestults = true;
			});
	}

	loadConstructionEntries(): void {
		const page = Math.ceil(this.constructionEntries.length / this.rows) + 1;

		this.filterConstructions(undefined, page, true)
			.then((content) => {
				this.totalConstructionCount = content.totalCount;
				if (this.totalConstructionCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.constructionEntries = [
					...this.constructionEntries,
					...content.data,
				];
			})
			.catch((err) => {
				this.totalConstructionCount = 0;
				this.noRestults = true;
			});
	}

	getConstructionPage(
		page = 1,
		numeroConstrucao?: string,
		idTipoConta?: number,
		idTipoImovel?: number,
		idStatus?: number
	): Promise<any> {
		this.isLoadingConstructions = true;

		return new Promise((res, rej) => {
			this.constructionService
				.getConstructions(
					this.rows,
					page,
					numeroConstrucao,
					idTipoConta,
					idTipoImovel,
					idStatus
				)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							console.log(event.data);

							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((construcao: any) => {
									return {
										nomeObra: construcao.nomeObra,
										predio: construcao.imovel.nome,
										imovel: construcao.imovel.nome,
										unidade: 'UNIDADE',
										valor: construcao.orcamento,
										dataInicio: construcao.dataInicio
											? new Date(construcao.dataInicio)
											: null,
										dataFim: construcao.dataFim
											? new Date(construcao.dataFim)
											: null,
										action: '',
										guidReferencia: construcao.guidReferencia,
									};
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingConstructions = false;
					},
					error: () => {
						this.isLoadingConstructions = false;
						rej(null);
					},
				});
		});
	}

	filterConstructions = (
		e?: Event,
		page: number = 1,
		stack: boolean = false
	): Promise<any> => {
		if (stack)
			return this.getConstructionPage(
				page,
				this.filterText,
				this.filterAccountType,
				this.filterPropertyType,
				this.filterStatus
			);
		else
			return this.setConstructionEntries(
				page,
				this.filterText,
				this.filterAccountType,
				this.filterPropertyType,
				this.filterStatus
			);
	};

	filterConstructionsDebounce: Function = Utils.debounce(
		this.filterConstructions,
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
