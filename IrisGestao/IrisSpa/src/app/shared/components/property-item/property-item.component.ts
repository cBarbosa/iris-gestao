import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Imovel } from '../../models';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	propertyType = this.randomize();
	@Input('data')
	propertyData: any;

	constructor(private router: Router) { }

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	randomize() {
		return Math.random() > 0.5 ? 'wallet' : 'market';
	}
}
