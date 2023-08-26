import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { LoginService, RentContractService } from 'src/app/shared/services';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';

@Component({
	selector: 'app-receiving-performance',
	templateUrl: './receiving-performance.component.html',
	styleUrls: ['./receiving-performance.component.scss'],
})
export class ReceivingPerformanceComponent {
	@ViewChild('chart') chartComponent: ChartComponent;
	@ViewChild('lineChart') lineChartComponent: ChartComponent;
	
	data: any;
	data2: any;
	filterLocador: number;
	filterTipo: number;
	filterPeriodo: Date[];

	isLoading: boolean = true;
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

	locadorComboEnabled:boolean = true;
	
	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private dashboardService: DashboardService,
		private rentContract: RentContractService,
		private loginService: LoginService
	) { };

	ngOnInit() {
		this.init();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.filter();
	};

	init():void {

		this.data = {
			labels: [],
			datasets: [
				{
					type: 'bar',
					label: 'Valor a receber',
					backgroundColor: `#641B1E`,
					data: [],
				},
				{
					type: 'bar',
					label: 'Valor recebido',
					backgroundColor: `#C9D78E`,
					data: [],
				}
			]
		};

		this.data2 = {
			labels: [],
			datasets: [
				{
					type: 'line',
					label: 'Performance de recebimento',
					borderColor: '#D08175',
					data: [],
				}
			]
		};

		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear, 0, 1), new Date(currYear, 11, 1)];
		this.locadorComboEnabled = this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'cliente';

		this.getOwnersListData();
		this.getUnitTypesData();

	};

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

			this.getReceivingPerformanceData(startDateString, endDateString, idLocador, idTipo);
		}
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

	getOwnersListData() {
		this.rentContract
			.getActiveOwners()
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
				}
			});
	};

	getUnitTypesData() {
		this.rentContract
			.getActiveUnitType()
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
				}
			});
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

	getReceivingPerformanceData(startDateString: string, endDateString: string, IdLocador?: number, IdTipoImovel?: number):void {

		if(!this.locadorComboEnabled)	{
			IdLocador = this.loginService.usuarioLogado.id;
		}
		
		this.dashboardService
			.getReceivingPerformance(startDateString, endDateString, IdLocador, IdTipoImovel)
			.pipe(first())
			.subscribe({
				next: (event) => {

					this.data.labels = [];
					this.data2.labels = [];

					this.data.datasets[0].data = []; // valor recebido
					this.data.datasets[1].data = []; // valor a receber
					this.data2.datasets[0].data = []; // performance

					event.data.forEach((item: any) => {
						this.data.labels.push(item.referencia);
						this.data2.labels.push(item.referencia);

						this.data.datasets[1].data.push(item.valorRecebido); // valor recebido
						this.data.datasets[0].data.push(item.valorReceber); // a receber
						this.data2.datasets[0].data.push(item.performanceRecebimento * 100.0); // performance
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

	savePDF():void {

		Utils
		.saveChartsAsPdf(
			this.chartComponent.chart,
			this.lineChartComponent.chart,
			'performance-recebimento',
			'Performance de recebimento');
	};

};
