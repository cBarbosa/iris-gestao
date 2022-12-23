import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { first } from 'rxjs';
import { Imovel } from 'src/app/shared/models';
import { ImovelService } from 'src/app/shared/services';

@Component({
	selector: 'app-property-listing',
	templateUrl: './property-listing.component.html',
	styleUrls: ['./property-listing.component.scss'],
})
export class PropertyListingComponent implements OnInit {
	properties: Imovel[] = [];

	totalListCount: number;
	isLoadingList = true;

	first = 0;
	rows = 10;

	constructor(private imovelService: ImovelService, private router: Router) {}

	ngOnInit(): void {
		this.getPagingData();
	}

	loadClientsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			this.isLoadingList = true;
			const page = Math.floor(event.first / this.rows) + 1;
			this.getPagingData(page);
		}
	}

	getPagingData(page: number = 1): void {
		setTimeout(() => {
			const list = this.imovelService
				.getProperties()
				?.pipe(first())
				.subscribe((event: any) => {
					this.properties = [];
					this.totalListCount = event.totalCount;

					event.items.forEach((imovel: Imovel) => {
						// console.debug('Imovel Data >> ' + JSON.stringify(imovel));
						this.properties.push(imovel);
					});
					this.isLoadingList = false;
				});
		}, 3000);
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
