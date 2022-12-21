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
	detailsVisible = false;

	units = [
		{
			name: 'Unidade nome',
			area_usable: '21',
			area_total: '32',
			area_occupancy: '32',
			lease_status: 'Unidade locada',
			action: '',
		},
		{
			name: 'Unidade nome',
			area_usable: '21',
			area_total: '32',
			area_occupancy: '32',
			lease_status: 'Unidade locada',
			action: '',
		},
		{
			name: 'Unidade nome',
			area_usable: '21',
			area_total: '32',
			area_occupancy: '32',
			lease_status: 'locada',
			action: '',
		},
		{
			name: 'Unidade nome',
			area_usable: '21',
			area_total: '32',
			area_occupancy: '32',
			lease_status: 'Unidade locada',
			action: '',
		},
	];

	constructor(private router: Router) {}

	ngOnInit() {
		this.tableMenu = [
			{
				label: 'Detalhes',
				icon: 'ph-eye',
				command: () => this.showDetails(),
			},
			{
				label: 'Editar',
				icon: 'ph-note-pencil',
				command: () => this.navigateTo('property-edit'),
			},
			{ label: 'Duplicar', icon: 'ph-copy-simple' },
		];
	}

	toggleFavorite() {
		this.isFavorite = !this.isFavorite;
	}

	showDetails() {
		this.detailsVisible = !this.detailsVisible;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
