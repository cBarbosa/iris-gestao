import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { CommonService, DominiosService, LoginService } from 'src/app/shared/services';
import { RevenueService } from 'src/app/shared/services/revenue.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-revenue-listing',
	templateUrl: './revenue-listing.component.html',
	styleUrls: ['./revenue-listing.component.scss'],
})
export class RevenueListingComponent {
	totalRevenueCount: number;
	isLoadingRevenues = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	noRestults = false;
	revenueEntries: any[];

	onInputDate: Function;
	onBlurDate: Function;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	cardPipes: Record<string, PipeTransform>;

	opcoesLocatario = [
		{
			label: 'Locatário',
			value: null,
		},
	];

	opcoesTipo = [
		{
			label: 'Tipo de Recebimento',
			value: null,
		},
	];

	filterTitulo: string = '';
	filterTipo: number;

	isFormEditable:boolean = true;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private commonService: CommonService,
		private dominiosService: DominiosService,
		private revenueService: RevenueService,
		private responsiveService: ResponsiveService,
		private loginService: LoginService
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

		if (this.isMobile) this.setRevenueEntries();

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
						this.opcoesLocatario.push(
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

		this.dominiosService
			.getTiposTitulo()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesTipo.push(
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

		this.isFormEditable = this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'analista';
	}

	loadRevenuesPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			// this.getRevenuePage(page, this.filterText);
			this.filterRevenues(undefined, page);
			this.scrollTop();
		}
	}

	setRevenueEntries(
		page = 1,
		numeroTitulo?: string,
		idTipoTitulo?: number
	): Promise<any> {
		this.revenueEntries = [];

		return this.getRevenuePage(page, numeroTitulo, idTipoTitulo)
			.then((content) => {
				this.totalRevenueCount = content.totalCount;
				if (this.totalRevenueCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.revenueEntries = content.data;
			})
			.catch((err) => {
				this.totalRevenueCount = 0;
				this.noRestults = true;
			});
	}

	loadRevenueEntries(): void {
		const page = Math.ceil(this.revenueEntries.length / this.rows) + 1;

		this.filterRevenues(undefined, page, true)
			.then((content) => {
				this.totalRevenueCount = content.totalCount;
				if (this.totalRevenueCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.revenueEntries = [...this.revenueEntries, ...content.data];
			})
			.catch((err) => {
				this.totalRevenueCount = 0;
				this.noRestults = true;
			});
	}

	getRevenuePage(
		page = 1,
		numeroTitulo?: string,
		idTipoTitulo?: number
	): Promise<any> {
		this.isLoadingRevenues = true;

		return new Promise((res, rej) => {
			this.revenueService
				.getRevenues(this.rows, page, numeroTitulo, idTipoTitulo)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							console.log(event.data);

							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((receita: any) => {
									return {
										tipoRecebimento: receita.nomeTitulo,
										nome: receita.nomeTitulo,
										numeroTitulo: receita.numeroTitulo,
										imovel: receita.imoveil?.[0].nome,
										locatario: receita.cliente?.nome,
										proprietario: receita.imoveil?.[0].idClienteProprietarioNavigation?.nome,
										valor: receita.valorTotalTitulo,
										dataVencimento: receita.dataFimTitulo
										? new Date(receita.dataFimTitulo)
										: null,
										dataUltimaParcela: receita.dataUltimaParcela
											? new Date(receita.dataUltimaParcela)
											: null,
										action: '',
										guidReferencia: receita.guidReferencia,
									};
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingRevenues = false;
					},
					error: () => {
						this.isLoadingRevenues = false;
						rej(null);
					},
				});
		});
	}

	filterRevenues = (
		e?: Event,
		page: number = 1,
		stack: boolean = false
	): Promise<any> => {
		if (stack)
			return this.getRevenuePage(page, this.filterTitulo, this.filterTipo);
		else
			return this.setRevenueEntries(page, this.filterTitulo, this.filterTipo);
	};

	filterRevenuesDebounce: Function = Utils.debounce(this.filterRevenues, 1000);

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
