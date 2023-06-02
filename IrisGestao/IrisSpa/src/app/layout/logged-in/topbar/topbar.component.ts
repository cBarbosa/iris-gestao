import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
	items: MenuItem[] = [];
	isMobile: boolean = false;
	displayMobileMenu: boolean = true;

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService
	) {
		router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event) => {
				this.updateTopMenu((event as NavigationEnd).url);
				this.closeMobileMenu();
			});
	}

	ngOnInit() {
		// Detect current route
		const currRoute = this.router.routerState.snapshot.url;
		this.updateTopMenu(currRoute);

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth <= 960;
		});
	}

	updateTopMenu(route: string) {
		this.items = [
			{
				label: 'Home',
				id: route.startsWith('/home/') ? 'current' : '',
				command: () => this.navigateTo('home'),
			},
			{
				label: 'Imóveis',
				id: route.startsWith('/property/') ? 'current' : '',
				command: () => this.navigateTo('property/listing'),
			},
			{
				label: 'Clientes',
				id: route.startsWith('/client/') ? 'current' : '',
				command: () => this.navigateTo('client/listing'),
			},
			{
				label: 'Contratos',
				items: [
					{
						label: 'Contrato de aluguel',
						id: route.startsWith('/rent-contract/') ? 'current' : '',
						command: () => this.navigateTo('rent-contract/listing'),
					},
					{
						label: 'Contrato de fornecedor',
						id: route.startsWith('/supplier-contract/') ? 'current' : '',
						command: () => this.navigateTo('supplier-contract/listing'),
					},
				],
			},
			// {
			// 	label: 'Gerenciamento de obras',
			// 	id: route.startsWith('/construction/') ? 'current' : '',
			// 	command: () => this.navigateTo('construction/listing'),
			// },
			{
				label: 'Fornecedores',
				id: route.startsWith('/supplier/') ? 'current' : '',
				command: () => this.navigateTo('supplier/listing'),
			},
			//{
			//	label: 'Financeiro',
			//	items: [
			//		{
			//			label: 'Receitas',
			//			id: route.startsWith('/revenue/') ? 'current' : '',
			//			command: () => this.navigateTo('revenue/listing'),
			//		},
			//		{
			//			label: 'Despesas',
			//			id: route.startsWith('/expense/') ? 'current' : '',
			//			command: () => this.navigateTo('expense/listing'),
			//		},
			//	],
			//},
			// {
			// 	label: 'Prestador de serviços',
			// },
			// {
			// 	label: 'Fornecedores',
			// },
			// {
			// 	label: 'Contas',
			// 	items: [
			// 		{
			// 			label: 'Opção 1',
			// 		},
			// 		{
			// 			separator: true,
			// 		},
			// 		{
			// 			label: 'Opção 2',
			// 		},
			// 	],
			// },
			// {
			// 	label: 'Gerenciamento de obras',
			// 	items: [
			// 		{
			// 			label: 'Opção 1',
			// 		},
			// 		{
			// 			label: 'Opção 2',
			// 		},
			// 	],
			// },
			{
				label: 'Análises',
				items: [
					{
						label: 'Vacância',
						id: route.startsWith('/dashboard') ? 'current' : '',
						command: () => this.navigateTo('dashboard/financial-vacancy')
					},
					{
						label: 'Recebimento',
						id: route.startsWith('/dashboard') ? 'current' : '',
						command: () => this.navigateTo('dashboard/receiving-performance')
					},
					{
						label: 'Preço M²',
						id: route.startsWith('/dashboard') ? 'current' : '',
						command: () => this.navigateTo('dashboard/area-price')
					},
					{
						label: 'M² Gerenciados',
						id: route.startsWith('/dashboard') ? 'current' : '',
						command: () => this.navigateTo('dashboard/managed-area')
					}
				]
			}
		];
	}

	openMobileMenu() {
		this.displayMobileMenu = true;
	}

	closeMobileMenu() {
		this.displayMobileMenu = false;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
