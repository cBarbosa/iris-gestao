import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ClienteService, CommonService } from 'src/app/shared/services';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-receiving-performance',
	templateUrl: './receiving-performance.component.html',
	styleUrls: ['./receiving-performance.component.scss'],
})
export class ReceivingPerformanceComponent {
	data: any;
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
	
	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private dashboardService: DashboardService,
		private clienteService: ClienteService,
		private commonService: CommonService,
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
					type: 'line',
					label: 'Performance de recebimento',
					borderColor: '#D08175',
					data: [],
				},
				{
					type: 'bar',
					label: 'Valor recebido',
					backgroundColor: `#C9D78E`,
					data: [],
				},
				{
					type: 'bar',
					label: 'Valor a receber',
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
				}
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
		this.dashboardService
			.getReceivingPerformance(startDateString, endDateString, IdLocador, IdTipoImovel)
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

};
