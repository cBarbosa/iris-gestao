import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { DropdownItem } from 'src/app/shared/models/types';
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
	options: any;

	isLoading: boolean = true;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;

	filterLocador: string;
	filterTipo: string;
	filterPeriodo: Date[];

	tabIndex: number = 0;

	tiposImovel: DropdownItem[] = [
		{
			label: 'Tipo de imóvel',
			value: null,
		},
	];

	locador: DropdownItem[] = [
		{
			label: 'Locador',
			value: null,
		},
	];

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private dashboardService: DashboardService
	) {}

	ngOnInit() {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear, 0, 1), new Date(currYear, 11, 31)];

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

		this.filter();
	}

	changeTab(i: number) {
		this.tabIndex = i;
	}

	filter = (e?: Event) => {
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

			this.dashboardService
				.getFinancialVacancy(1, 1, startDateString, endDateString)
				.pipe(first())
				.subscribe({
					next: (event) => {
						console.log(event);

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
						this.isLoading = false;
					},
					error: () => {},
				});
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
}
