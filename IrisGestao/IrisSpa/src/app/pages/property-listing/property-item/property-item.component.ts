import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	constructor(private router: Router) {}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	randomize() {
		return Math.random() > 0.5 ? 'wallet' : 'market';
	}
}
