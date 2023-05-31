import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownItem } from 'src/app/shared/models/types';
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

	isLoading: boolean = false;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;

	filterLocador: string;
	filterTipo: string;
	filterPeriodo: string;

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
		private responsiveService: ResponsiveService
	) {}

	ngOnInit() {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.data = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
			datasets: [
				{
					type: 'line',
					label: 'Dataset 1',
					borderColor: '#D08175',
					data: [50, 25, 12, 48, 56, 76, 42],
				},
				{
					type: 'bar',
					label: 'Dataset 2',
					backgroundColor: `#C9D78E`,
					data: [21, 84, 24, 75, 37, 65, 34],
				},
				{
					type: 'bar',
					label: 'Dataset 3',
					backgroundColor: `#641B1E`,
					data: [41, 52, 24, 74, 23, 21, 32],
				},
			],
		};

		this.data2 = {
			datasets: [
				{
					type: 'percent',
					color: '#641B1E',
					data: 60,
				},
			],
		};
	}

	changeTab(i: number) {
		this.tabIndex = i;
	}

	filter = (e: Event) => {
		console.log(e);

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
