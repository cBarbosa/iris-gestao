import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { DropdownItem } from 'src/app/shared/models/types';
import { LoginService, RentContractService } from 'src/app/shared/services';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-managed-area',
	templateUrl: './managed-area.component.html',
	styleUrls: ['./managed-area.component.scss'],
})
export class ManagedAreaComponent {
	data: any = [];
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
			endDate.setDate(
				Utils.getDaysInMonth(
					this.filterPeriodo[1].getMonth() + 1,
					this.filterPeriodo[1].getFullYear()
				)
			);

			const startDateString = startDate.toISOString().split('T')[0];
			const endDateString = endDate.toISOString().split('T')[0];
			const idLocador = this.filterLocador ?? null;

			this.getManagedAreaData(startDateString, endDateString, idLocador);
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
		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear, 0, 1), new Date(currYear, 11, 31)];
		this.locadorComboEnabled = this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'cliente';

		this.getOwnersListData();
	};

	getManagedAreaData(startDateString: string, endDateString: string, IdLocador?: number): void {

		if(!this.locadorComboEnabled)	{
			IdLocador = this.loginService.usuarioLogado.id;
		}

		this.dashboardService
			.getManagedArea(startDateString, endDateString, IdLocador)
			.pipe(first())
			.subscribe({
				next: (event) => {

					this.data = [];

					event.data.forEach((item: any) => {
						this.data.push(item);
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
}
