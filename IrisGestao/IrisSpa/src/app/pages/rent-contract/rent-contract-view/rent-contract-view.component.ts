import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-rent-contract-view',
	templateUrl: './rent-contract-view.component.html',
	styleUrls: ['./rent-contract-view.component.scss'],
})
export class RentContractViewComponent {
	contract: any;
	isLoadingView = false;

	constructor(private router: Router) {}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
