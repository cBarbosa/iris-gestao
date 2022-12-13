import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-property-view',
	templateUrl: './property-view.component.html',
	styleUrls: ['./property-view.component.scss'],
})
export class PropertyViewComponent {
	tableMenu: MenuItem[];

	isFavorite = true;

	units = [
		{
			name: 'Unidade nome',
			area_usable: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
		{
			name: 'Unidade nome',
			area_usable: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
		{
			name: 'Unidade nome',
			area_usable: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'locada',
			action: '...',
		},
		{
			name: 'Unidade nome',
			area_usable: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
	];

	constructor(private router: Router) {}

	ngOnInit() {
		this.tableMenu = [
			{ label: 'Detalhes' },
			{ label: 'Editar', command: () => this.navigateTo('property-edit') },
			{ label: 'Duplicar' },
		];
	}

	toggleFavorite() {
		this.isFavorite = !this.isFavorite;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
