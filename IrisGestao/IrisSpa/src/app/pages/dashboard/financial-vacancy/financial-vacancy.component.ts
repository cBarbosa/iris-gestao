import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { DropdownItem } from 'src/app/shared/models/types';
import { ClienteService, CommonService } from 'src/app/shared/services';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-financial-vacancy',
	templateUrl: './financial-vacancy.component.html',
	styleUrls: ['./financial-vacancy.component.scss'],
})
export class FinancialVacancyComponent implements OnInit {
	data: any;
	data2: any;
	options: any;

	isLoading: boolean = true;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;

	filterLocador: number;
	filterTipo: number;
	filterPeriodo: Date[];

	tabIndex: number = 0;

	proprietaryOptions: {
		label: string;
		value: string | null;
	}[] = [{ label: 'Todos os proprietários', value: null }];

	categoryOptions: {
		label: string;
		value: string | null;
	}[] = [{ label: 'Todos os tipos de imóveis', value: null }];

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private dashboardService: DashboardService,
		private clienteService: ClienteService,
		private commonService: CommonService,
	) {}

	ngOnInit() {
		this.init();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.filter();
	}

	changeTab(i: number) {
		this.tabIndex = i;
		this.filter();
	}

	filter = (e?: Event) => {

		this.isLoading = true;

		console.log(e);

		if ((this.filterPeriodo?.[0], this.filterPeriodo?.[1])) {
			const startDate = new Date(this.filterPeriodo[0]);
			startDate.setDate(1);
			const endDate = new Date(this.filterPeriodo[1]);
			endDate.setDate(
				Utils.getDaysInMonth(
					this.filterPeriodo[1].getMonth() + 1,
					this.filterPeriodo[1].getFullYear()
				)
			);

			const startDateString = startDate.toISOString().split('T')[0];
			const endDateString = endDate.toISOString().split('T')[0];
			const idLocador = this.filterLocador ?? null;
			const idTipo = this.filterTipo ?? null;

			if(this.tabIndex == 0)
				this.getFinancialVacancyData(startDateString, endDateString, idLocador, idTipo);
			else
				this.getPhysicalVacancyData(startDateString, endDateString, idLocador, idTipo);
		}

		// this.setClientEntries(1, this.filterText, this.filterType);
	};

	filterClientDebounce: Function = Utils.debounce(this.filter, 1000);

	openFilters() {
		this.displayMobileFilters = true;
	}

	closeFilters() {
		this.displayMobileFilters = false;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	getFinancialVacancyData(startDateString: string, endDateString: string, IdLocador?: number, IdTipoImovel?: number) {
		this.dashboardService
			.getFinancialVacancy(startDateString, endDateString, IdLocador, IdTipoImovel)
			.pipe(first())
			.subscribe({
				next: (event) => {

					this.data.labels = [];
					this.data.datasets[1].data = []; // contratada
					this.data.datasets[2].data = []; // potencial
					this.data.datasets[0].data = []; // financeira

					event.data.forEach((item: any) => {
						this.data.labels.push(item.referencia);
						this.data.datasets[1].data.push(item.contratada); // contratada
						this.data.datasets[2].data.push(item.potencial); // potencial
						this.data.datasets[0].data.push(item.financeira); // financeira
					});
				},
				error: () => {
					console.error(console.error);
				},
				complete: () => {
					this.isLoading = false;
				}
			});
	};

	getPhysicalVacancyData(startDateString: string, endDateString: string, IdLocador?: number, IdTipoImovel?: number) {
		this.dashboardService
			.getFinancialVacancy(startDateString, endDateString, IdLocador, IdTipoImovel)
			.pipe(first())
			.subscribe({
				next: (event) => {

					this.data2.labels = [];
					this.data2.datasets[1].data = []; // contratada
					this.data2.datasets[2].data = []; // potencial
					this.data2.datasets[0].data = []; // financeira

					event.data.forEach((item: any) => {
						this.data2.labels.push(item.referencia);
						this.data2.datasets[1].data.push(item.contratada); // contratada
						this.data2.datasets[2].data.push(item.potencial); // potencial
						this.data2.datasets[0].data.push(item.financeira); // financeira
					});
				},
				error: () => {
					console.error(console.error);
				},
				complete: () => {
					this.isLoading = false;
				}
			});
	};

	init() {

		this.data = {
			labels: [],
			datasets: [
				{
					type: 'line',
					label: 'Vacância financeira',
					borderColor: '#D08175',
					data: [],
				},
				{
					type: 'bar',
					label: 'Receita contratada',
					backgroundColor: `#C9D78E`,
					data: [],
				},
				{
					type: 'bar',
					label: 'Receita potencial',
					backgroundColor: `#641B1E`,
					data: [],
				},
			],
		};

		this.data2 = {
			labels: [],
			datasets: [
				{
					type: 'line',
					label: 'Vacância financeira',
					borderColor: '#D08175',
					data: [],
				},
				{
					type: 'bar',
					label: 'Receita contratada',
					backgroundColor: `#C9D78E`,
					data: [],
				},
				{
					type: 'bar',
					label: 'Receita potencial',
					backgroundColor: `#641B1E`,
					data: [],
				},
			],
		};

		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear, 0, 1), new Date(currYear, 11, 31)];

		this.getOwnersListData();
		this.getUnitTypesData();

	};

	truncateChar(text: string): string {
		const charlimit = 48;
		if (!text || text.length <= charlimit) {
			return text;
		}

		const without_html = text.replace(/<(?:.|\n)*?>/gm, '');
		const shortened = without_html.substring(0, charlimit) + '...';
		return shortened;
	};

	getOwnersListData() {
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
	};

	getUnitTypesData() {
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
	};
}
