import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownItem } from 'src/app/shared/models/types';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-managed-area',
	templateUrl: './managed-area.component.html',
	styleUrls: ['./managed-area.component.scss'],
})
export class ManagedAreaComponent {
	data: any;
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

		this.data = [
			{
				title: 'Coorporativo CNC',
				percent: 66.79,
				color: '#641B1E',
			},
			{
				title: 'Coorporativo Stylos',
				percent: 29.91,
				color: '#C9D78E',
			},
			{
				title: 'Varejo CNC',
				percent: 3.3,
				color: '#FF9922',
			},
			{
				title: 'Teste',
				percent: 60,
				color: '#641B1E',
			},
		];
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
