import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { LoginService } from 'src/app/shared/services';

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
		private responsiveService: ResponsiveService,
		private loginService: LoginService
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
				// id: route.startsWith('/property/') ? 'current' : '',
				// command: () => this.navigateTo('property/listing'),
				visible: this.isUserAdmin(),
				items: [
					{
						label: 'Imóvel de carteira',
						id: route.startsWith('property/carteira/') ? 'current' : '',
						command: () => this.navigateTo('property/carteira/listing'),
					},
					{
						label: 'Imóvel de mercado',
						id: route.startsWith('property/mercado/') ? 'current' : '',
						command: () => this.navigateTo('property/mercado/listing'),
					}
				],
			},
			{
				label: 'Clientes',
				id: route.startsWith('/client/') ? 'current' : '',
				command: () => this.navigateTo('client/listing'),
				visible: this.isUserAdmin(),
			},
			{
				label: 'Contratos',
				visible: this.isUserAdmin(),
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
			{
				label: 'Gerenciamento de obras',
				id: route.startsWith('/construction/') ? 'current' : '',
				command: () => this.navigateTo('construction/listing'),
			},
			{
				label: 'Fornecedores',
				visible: this.isUserAdmin(),
				id: route.startsWith('/supplier/') ? 'current' : '',
				command: () => this.navigateTo('supplier/listing'),
			},
			{
				label: 'Financeiro',
				visible: this.isUserAdmin(),
				items: [
					{
						label: 'Receitas',
						id: route.startsWith('/revenue/') ? 'current' : '',
						command: () => this.navigateTo('revenue/listing'),
					},
					{
						label: 'Despesas',
						id: route.startsWith('/expense/') ? 'current' : '',
						command: () => this.navigateTo('expense/listing'),
					},
				],
			},
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
						id: route.startsWith('/dashboard/') ? 'current' : '',
						command: () => this.navigateTo('dashboard/financial-vacancy'),
					},
					{
						label: 'Recebimento',
						id: route.startsWith('/dashboard/') ? 'current' : '',
						command: () => this.navigateTo('dashboard/receiving-performance'),
					},
					{
						label: 'Preço M²',
						id: route.startsWith('/dashboard/') ? 'current' : '',
						command: () => this.navigateTo('dashboard/area-price'),
					},
					{
						label: 'M² Gerenciados',
						id: route.startsWith('/dashboard/') ? 'current' : '',
						command: () => this.navigateTo('dashboard/managed-area'),
					},
				],
			},
			{
				label: 'Relatórios',
				visible: this.isUserAdmin(),
				items: [
					{
						label: 'Área locada             ',
						id: route.startsWith('/report/') ? 'current' : '',
						command: () => this.navigateTo('report/leased-area'),
					},
					{
						label: 'Valor aluguel',
						id: route.startsWith('/report/rent-amount') ? 'current' : '',
						command: () => this.navigateTo('report/rent-amount'),
					},
					{
						label: 'Gestão de contratos',
						id: route.startsWith('/report/supply-contracts') ? 'current' : '',
						command: () => this.navigateTo('report/supply-contracts'),
					},
					{
						label: 'Despesas',
						id: route.startsWith('/report/costs') ? 'current' : '',
						command: () => this.navigateTo('report/costs'),
					},
					{
						label: 'Receitas',
						id: route.startsWith('/report/receipts') ? 'current' : '',
						command: () => this.navigateTo('report/receipts'),
					},
					{
						label: 'DIMOB',
						id: route.startsWith('/report/dimob') ? 'current' : '',
						command: () => this.navigateTo('report/dimob'),
					},
					{
						label: 'Comercial de Imóveis',
						id: route.startsWith('/report/commercial') ? 'current' : '',
						command: () => this.navigateTo('report/commercial'),
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

	isUserAdmin():boolean {
		return this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'cliente';
	};
}
