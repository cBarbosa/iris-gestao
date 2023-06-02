import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownItem } from 'src/app/shared/models/types';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-area-price',
	templateUrl: './area-price.component.html',
	styleUrls: ['./area-price.component.scss'],
})
export class AreaPriceComponent {
	data: any;
	options: any;

	isLoading: boolean = false;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;

	filterLocador: string;
	filterTipo: string;
	filterPeriodo: [Date, Date];

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
					label: 'Média ponderada',
					backgroundColor: 'white',
					borderColor: '#480D1A',
					data: [50, 25, 12, 48, 56, 76, 42],
				},
				{
					type: 'line',
					label: 'Média Simples',
					backgroundColor: 'white',
					borderColor: '#6B7C36',
					data: [21, 84, 24, 75, 37, 65, 34],
				},
				{
					type: 'line',
					label: 'Média',
					backgroundColor: 'white',
					borderColor: `#D08175`,
					data: [41, 52, 24, 74, 23, 21, 32],
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
