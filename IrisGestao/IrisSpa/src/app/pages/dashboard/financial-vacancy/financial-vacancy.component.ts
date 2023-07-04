import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
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
	data3: any;
	options: any;

	isLoading: boolean = false;

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

	@ViewChild('chart') chartComponent: ChartComponent;
	@ViewChild('newChart') newChartComponent: ChartComponent;
	@ViewChild('lineChart') lineChartComponent: ChartComponent;

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private dashboardService: DashboardService,
		private clienteService: ClienteService,
		private commonService: CommonService
	) { };

	ngOnInit():void {
		this.init();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.filter();
	};

	savePDF():void {
		const chartRef = this.tabIndex === 0
			? this.chartComponent.chart
			: this.newChartComponent.chart;

		const fileName = this.tabIndex === 0
			? `vacancia_financeira`
			: `vacancia_fisica`;
		const title = this.tabIndex === 0
			? `Vacância Financeira`
			: `Vacância Física`;

		Utils.saveChartsAsPdf(chartRef, this.lineChartComponent.chart, fileName, title);
	};

	changeTab(i: number) {
		this.tabIndex = i;
		this.filter();
	}

	filter = (e?: Event) => {

		this.isLoading = true;

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

			console.log(this.tabIndex);
			if(this.tabIndex == 0)
				this.getPhysicalVacancyData(startDateString, endDateString, idLocador, idTipo);
			else
				this.getFinancialVacancyData(startDateString, endDateString, idLocador, idTipo);
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

					this.data2.labels = [];
					this.data3.labels = [];
					this.data2.datasets[1].data = []; // contratada
					this.data2.datasets[0].data = []; // potencial
					this.data3.datasets[0].data = []; // financeira

					event.data.forEach((item: any) => {
						this.data2.labels.push(item.referencia);
						this.data3.labels.push(item.referencia);
						this.data2.datasets[1].data.push(item.contratada); // contratada
						this.data2.datasets[0].data.push(item.potencial); // potencial
						this.data3.datasets[0].data.push(item.financeira); // financeira
					});
				},
				error: () => {
					console.error(console.error);
				},
				complete: () => {
					this.isLoading = false;
					console.log(this.data);
				}
			});
	};

	getPhysicalVacancyData(startDateString: string, endDateString: string, IdLocador?: number, IdTipoImovel?: number) {
		this.dashboardService
			.getPhysicalVacancy(startDateString, endDateString, IdLocador, IdTipoImovel)
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.data.labels = [];
					this.data3.labels = [];
					this.data.datasets[1].data = []; // contratada
					this.data.datasets[0].data = []; // potencial
					this.data3.datasets[0].data = []; // fisica

					event.data.forEach((item: any) => {
						this.data.labels.push(item.referencia);
						this.data3.labels.push(item.referencia);
						this.data.datasets[1].data.push(item.contratada); // contratada
						this.data.datasets[0].data.push(item.potencial); // potencial
						this.data3.datasets[0].data.push(item.fisica); // financeira
					});
				},
				error: () => {
					console.error(console.error);
				},
				complete: () => {
					this.isLoading = false;
					console.log(this.data2);
				}
			});
	};

	init() {

		this.data = {
			labels: [],
			datasets: [
				{
					type: 'bar',
					label: 'Receita potencial',
					backgroundColor: `#641B1E`,
					data: [],
				},
				{
					type: 'bar',
					label: 'Receita contratada',
					backgroundColor: `#C9D78E`,
					data: [],
				}
			],
		};

		this.data2 = {
			labels: [],
			datasets: [
				{
					type: 'bar',
					label: 'Área potencial',
					backgroundColor: `#641B1E`,
					data: [],
				},
				{
					type: 'bar',
					label: 'Área contratada',
					backgroundColor: `#C9D78E`,
					data: [],
				}
			],
		};

		this.data3 = {
			labels: [],
			datasets: [
				{
					type: 'line',
					label: 'Vacância financeira',
					borderColor: '#D08175',
					data: [],
				}
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
