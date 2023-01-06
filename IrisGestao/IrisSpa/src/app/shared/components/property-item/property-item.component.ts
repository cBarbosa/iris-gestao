import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Imovel } from '../../models';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	@Input('data')
	propertyData: Imovel;

	constructor(private router: Router) {}

	ngOnInit() {
		console.log(this.propertyData);
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
