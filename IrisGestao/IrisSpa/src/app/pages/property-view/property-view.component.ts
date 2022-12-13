import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-property-view',
	templateUrl: './property-view.component.html',
	styleUrls: ['./property-view.component.scss'],
})
export class PropertyViewComponent {
	tableMenu: MenuItem[];

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

	ngOnInit() {
		this.tableMenu = [
			{ label: 'Detalhes' },
			{ label: 'Editar' },
			{ label: 'Duplicar' },
		];
	}
}
