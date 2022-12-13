import { Component } from '@angular/core';

@Component({
	selector: 'app-property-view',
	templateUrl: './property-view.component.html',
	styleUrls: ['./property-view.component.scss'],
})
export class PropertyViewComponent {
	units = [
		{
			name: 'Unidade nome',
			area_useful: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
		{
			name: 'Unidade nome',
			area_useful: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
		{
			name: 'Unidade nome',
			area_useful: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
		{
			name: 'Unidade nome',
			area_useful: '21 m²',
			area_total: '32 m²',
			area_occupancy: '32 m²',
			lease_status: 'Unidade locada',
			action: '...',
		},
	];
}
