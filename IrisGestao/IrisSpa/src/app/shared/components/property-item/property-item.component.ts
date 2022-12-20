import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Imovel } from '../../models';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	@Input()
	imovel: any;

	propertyType = this.randomize();

	constructor(private router: Router) {
		console.debug('imovel', this.imovel);
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	randomize() {
		return Math.random() > 0.5 ? 'wallet' : 'market';
	}
}
