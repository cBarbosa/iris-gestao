import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
	items: MenuItem[] = [];

	constructor(private router: Router) {
		router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event) => {
				this.updateTopMenu((event as NavigationEnd).url);
			});
	}

	ngOnInit() {
		// Detect current route
		const currRoute = this.router.routerState.snapshot.url;
		this.updateTopMenu(currRoute);
	}

	updateTopMenu(route: string) {
		this.items = [
			{
				label: 'Home',
				id: route.startsWith('/home') ? 'current' : '',
				command: () => this.navigateTo('home'),
			},
			{
				label: 'Imóveis',
				id: route.startsWith('/property') ? 'current' : '',
				command: () => this.navigateTo('property/listing'),
			},
			{
				label: 'Clientes',
				id: route.startsWith('/client') ? 'current' : '',
				command: () => this.navigateTo('client/listing'),
			},
			// {
			// 	label: 'Contratos',
			// 	id: route.startsWith('/rent-contract') ? 'current' : '',
			// 	command: () => this.navigateTo('rent-contract/listing'),
			// },
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
		];
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
