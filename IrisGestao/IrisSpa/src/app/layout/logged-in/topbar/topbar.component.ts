import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
	items: MenuItem[] = [];

	constructor(private router: Router) {}

	ngOnInit() {
		this.items = [
			{
				label: 'Home',
			},
			{
				label: 'Imóveis',
				id: 'current',
				command: () => this.navigateTo('property-listing'),
			},
			{
				label: 'Clientes',
			},
			{
				label: 'Prestador de serviços',
			},
			{
				label: 'Fornecedores',
			},
			{
				label: 'Contas',
				items: [
					{
						label: 'Opção 1',
					},
					{
						separator: true,
					},
					{
						label: 'Opção 2',
					},
				],
			},
			{
				label: 'Gerenciamento de obras',
				items: [
					{
						label: 'Opção 1',
					},
					{
						label: 'Opção 2',
					},
				],
			},
		];
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
