import { CurrencyPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { AreaPipe } from 'src/app/shared/pipes/area.pipe';
import { ReportLeasedAreaService } from 'src/app/shared/services/anexo.service copy';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-report-leased-area',
	templateUrl: './report-leased-area.component.html',
	styleUrls: ['./report-leased-area.component.scss'],
})
export class ReportLeasedAreaComponent {
	isLoading: boolean = false;
	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	totalAreaCount: number;
	noRestults: boolean = false;
	filterText: string = '';
	resultEntries: any[];
	cardPipes: Record<string, PipeTransform>;

	totalSum:
		| {
				area: number;
				areaUtil: number;
				areaHabitese: number;
				aluguelContratado: number;
				aluguelPotencial: number;
		  }
		| undefined;

	first = 0;
	rows = 10;
	pageIndex = 1;

	opcoesImovel = [
		{
			label: 'Todos Imóveis',
			value: null,
		},
	];
	opcoesTipoImovel = [
		{
			label: 'Tipo Imóvel',
			value: null,
		},
	];
	opcoesLocador = [
		{
			label: 'Locador',
			value: null,
		},
	];
	opcoesLocatario = [
		{
			label: 'Locatário',
			value: null,
		},
	];
	opcoesStatus = [
		{
			label: 'Status',
			value: null,
		},
	];

	filterImovel: string;
	filterTipoImovel: string;
	filterLocador: string;
	filterLocatario: string;
	filterStatus: string;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private responsiveService: ResponsiveService,
		private reportLeasedAreaService: ReportLeasedAreaService
	) {}

	ngOnInit(): void {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			area: new AreaPipe(),
			currency: new CurrencyPipe('pt-BR', 'R$'),
		};

		this.reportLeasedAreaService
			.getLeasedArea()
			.pipe(first())
			.subscribe({
				next: (data) => {
					if (data) {
						this.resultEntries = data;

						this.totalSum = data.reduce(
							(acc, entry) => {
								acc.area += entry.somaAreaTotal;
								acc.areaUtil += entry.somaAreaUtil;
								acc.areaHabitese += entry.somaAreaHabitese;
								acc.aluguelContratado += entry.somaValorAluguel;
								acc.aluguelPotencial += entry.somaValorPotencial;

								return acc;
							},
							{
								area: 0,
								areaUtil: 0,
								areaHabitese: 0,
								aluguelContratado: 0,
								aluguelPotencial: 0,
							}
						);
					}
				},
			});
	}

	filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		console.log(e);

		// if (stack) return this.getPage(page, this.filterText);
		// else return this.setEntries(page, this.filterText);
	};

	loadResultPage(event: LazyLoadEvent): void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.filterResult(undefined, page);
			this.scrollTop();
		}
	}

	filterResultDebounce: Function = Utils.debounce(this.filterResult, 1000);

	openFilters() {
		this.displayMobileFilters = true;
	}

	scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	}

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
	};
}
