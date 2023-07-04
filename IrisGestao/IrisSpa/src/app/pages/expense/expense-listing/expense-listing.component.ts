import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { CommonService, DominiosService } from 'src/app/shared/services';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-expense-listing',
	templateUrl: './expense-listing.component.html',
	styleUrls: ['./expense-listing.component.scss'],
})
export class ExpenseListingComponent {
	totalExpenseCount: number;
	isLoadingExpenses = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	noRestults = false;
	expenseEntries: any[];

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

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private commonService: CommonService,
		private dominiosService: DominiosService,
		private expenseService: ExpenseService,
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

		if (this.isMobile) this.setExpenseEntries();

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
	}

	loadExpensesPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			// this.getExpensePage(page, this.filterText);
			this.filterExpenses(undefined, page);
			this.scrollTop();
		}
	}

	setExpenseEntries(
		page = 1,
		numeroTitulo?: string,
		idTipoTitulo?: number
	): Promise<any> {
		this.expenseEntries = [];

		return this.getExpensePage(page, numeroTitulo, idTipoTitulo)
			.then((content) => {
				this.totalExpenseCount = content.totalCount;
				if (this.totalExpenseCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.expenseEntries = content.data;
			})
			.catch((err) => {
				this.totalExpenseCount = 0;
				this.noRestults = true;
			});
	}

	loadExpenseEntries(): void {
		const page = Math.ceil(this.expenseEntries.length / this.rows) + 1;

		this.filterExpenses(undefined, page, true)
			.then((content) => {
				this.totalExpenseCount = content.totalCount;
				if (this.totalExpenseCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.expenseEntries = [...this.expenseEntries, ...content.data];
			})
			.catch((err) => {
				this.totalExpenseCount = 0;
				this.noRestults = true;
			});
	}

	getExpensePage(
		page = 1,
		numeroTitulo?: string,
		idTipoTitulo?: number
	): Promise<any> {
		this.isLoadingExpenses = true;

		return new Promise((res, rej) => {
			this.expenseService
				.getExpenses(this.rows, page, numeroTitulo, idTipoTitulo)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							console.log(event.data);

							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((despesa: any) => {
									return {
										nomeTitulo: despesa.nomeTitulo,
										tipoDocumento: despesa.tipoTituloPagar?.nome,
										imovel: despesa.imovel.length > 0 
											? despesa.imovel?.[0].nome
											: '',
										locador: despesa.cliente?.nome,
										proprietario: despesa.imovel?.[0].idClienteProprietarioNavigation?.nome,
										valor: despesa.valorTotalTitulo,
										dataVencimento: despesa.dataFimTitulo
											? new Date(despesa.dataFimTitulo)
											: null,
										dataUltimaParcela: despesa.dataUltimaParcela
											? new Date(despesa.dataUltimaParcela)
											: null,
										action: '',
										guidReferencia: despesa.guidReferencia,
									};
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingExpenses = false;
					},
					error: () => {
						this.isLoadingExpenses = false;
						rej(null);
					},
				});
		});
	}

	filterExpenses = (
		e?: Event,
		page: number = 1,
		stack: boolean = false
	): Promise<any> => {
		if (stack)
			return this.getExpensePage(page, this.filterTitulo, this.filterTipo);
		else
			return this.setExpenseEntries(page, this.filterTitulo, this.filterTipo);
	};

	filterExpensesDebounce: Function = Utils.debounce(this.filterExpenses, 1000);

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
