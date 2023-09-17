import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { first, firstValueFrom } from 'rxjs';
import { DropdownItem } from 'src/app/shared/models/types';
import { LoginService, RentContractService } from 'src/app/shared/services';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';
import { PercentChartCardComponent } from 'src/app/shared/components/percent-chart-card/percent-chart-card.component';

@Component({
	selector: 'app-managed-area',
	templateUrl: './managed-area.component.html',
	styleUrls: ['./managed-area.component.scss'],
})
export class ManagedAreaComponent {
	@ViewChild('chartDoughnut') chartDoughnutComponent: PercentChartCardComponent;
	@ViewChild('chart') chartComponent: ChartComponent;

	data: {
		labels: Array<string>,
		datasets: Array<{
			label?: string;
			data: Array<number>,
			type: 'doughnut' | 'line' | 'bar' | 'percent' | 'pie',
			[index: string]: any,
			opt?: number
		}>
	} = {
		labels: [],
		datasets: []
	};
	dataDoughnut: {
		title: string;
		datasets: Array<{
			percent: number;
			title: string;
			color: string;
		}>
	};

	options: any;

	isLoading: boolean = false;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	
	filterLocador: number;
	filterPeriodo: Date[];

	tabIndex: number = 0;

	locador: DropdownItem[] = [
		{
			label: 'Locador',
			value: null,
		},
	];

	proprietaryOptions: {
		label: string;
		value: string | null;
	}[] = [{ label: 'Proprietários', value: null }];

	locadorComboEnabled:boolean = true;

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private dashboardService: DashboardService,
		private rentContract: RentContractService,
		private loginService: LoginService
	) {}

	ngOnInit():void {
		this.init();
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.filter();
	};

	filter = (e?: Event) => {
		this.isLoading = true;

		if ((this.filterPeriodo?.[0], this.filterPeriodo?.[1])) {
			const startDate = new Date(this.filterPeriodo[0]);
			startDate.setDate(1);
			const endDate = new Date(this.filterPeriodo[1]);
			endDate.setDate(1);

			const startDateString = startDate.toISOString().split('T')[0];
			const endDateString = endDate.toISOString().split('T')[0];
			const idLocador = this.filterLocador ?? null;

			this.getGroupResult(startDateString, endDateString, idLocador);
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

	init():void {

		this.data = {
			labels: [],
			datasets: [
				{
					type: 'bar',
					label: 'Total m² gerenciados',
					// backgroundColor: `#641B1E`,
					data: []
				}
			]
		};

		this.dataDoughnut = {
			title: 'Total m² gerenciados',
			datasets: []
		};

		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear, 0, 1), new Date(currYear, 11, 31)];
		this.locadorComboEnabled = this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'cliente';

		this.getOwnersListData();
	};

	getGroupResult = (
		startDateString: string,
		endDateString: string,
		IdLocador?: number):void => {

		Promise.all([
			this.getManagedAreaData(startDateString, endDateString, IdLocador),
			this.getManagedAreaStackData(startDateString, endDateString, IdLocador)
		]).then(([managedArea, managedAreaStack]) => {

			this.data.datasets = [];
		 	this.data.labels = [];

			this.dataDoughnut.datasets = [];
			let arrayManagedStackFinal: Array<any> = [];

			if(managedArea.success) {
				managedArea.data.forEach((item: { title: string, percent: number, color: string }) => {
					this.dataDoughnut.datasets.push({
						color: item.color,
						percent: item.percent,
						title: item.title
					});
				});
			}

			if(managedAreaStack.success)	{

				const distinctCompanies = managedAreaStack.data.filter(
					(thing:any, i:number, arr:[]) => arr.findIndex((t:any) => t.nomeLocador === thing.nomeLocador) === i
				).map((k:any) => k.nomeLocador);

				managedAreaStack.data.forEach((item: { periodo: string, nomeLocador: string, valor: number }) => {

					if(!this.data.labels.find(i => i === item.periodo)) {
						this.data.labels.push(item.periodo);

						let arrayCompany: Array<any> = [];

						distinctCompanies.forEach((comp:any) => {

							const hasValue = managedAreaStack.data.find((x:any) =>
								x.periodo === item.periodo && x.nomeLocador === comp
							);

							const valued = hasValue
								? {nomeLocador: comp, periodo: item.periodo, valor: hasValue.valor}
								: {nomeLocador: comp, periodo: item.periodo, valor: 0};

							arrayCompany.push(valued);
							arrayManagedStackFinal.push(valued);
						});
					}
				});

				distinctCompanies.forEach((element:any) => {
					const itemsArray = arrayManagedStackFinal
						.filter(x => x.nomeLocador === element)
						.map(y => y);

					this.data.datasets.push(
					{
						type: 'bar',
						label: element,
						opt: 1,
						data: itemsArray.map(x => x.valor)
					});
				});
			}
		})
		.finally(() => this.isLoading = false);
	};

	getManagedAreaData = async (
		startDateString: string,
		endDateString: string,
		IdLocador?: number)
	: Promise<any> => {

		if(!this.locadorComboEnabled)	{
			IdLocador = this.loginService.usuarioLogado.id;
		}

		return firstValueFrom(this.dashboardService
			.getManagedArea(startDateString, endDateString, IdLocador)
		);
	};

	getManagedAreaStackData = async (
		startDateString: string,
		endDateString: string,
		IdLocador?: number)
	: Promise<any> => {

		if(!this.locadorComboEnabled)	{
			IdLocador = this.loginService.usuarioLogado.id;
		}

		return firstValueFrom(this.dashboardService
			.getManagedAreaStack(startDateString, endDateString, IdLocador)
		);
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
				},
			});
	};

	savePDF():void {

		const fileName = `m²_gerenciados`;
		const title = `Total m² gerenciados`;

		Utils.saveChartsAsPdf(this.chartDoughnutComponent.chart, this.chartComponent.chart, fileName, title);
	};
}
