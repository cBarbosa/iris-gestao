import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Imovel } from '../../models';
import { PropertyItemData } from '../../models';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	propertyType = this.randomize();
  @Input()
	imovel: any;
	@Input('data')
	propertyData: any;

	constructor(private router: Router) {
		console.debug('imovel', this.imovel);
	}

	ngOnInit() {
		console.log(this.propertyData);
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
