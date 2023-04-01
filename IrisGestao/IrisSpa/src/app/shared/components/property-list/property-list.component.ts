import { Component, Input } from '@angular/core';
import { PropertyItemModule } from '../property-item/property-item.module';
import { IImovel } from 'src/app/shared/models';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SpinnerComponent } from '../custom-ui/spinner/spinner.component';

@Component({
	standalone: true,
	imports: [
		CommonModule,
		PropertyItemModule,
		PaginatorModule,
		SpinnerComponent,
	],
	selector: 'app-property-list',
	templateUrl: './property-list.component.html',
	styleUrls: ['./property-list.component.scss'],
})
export class PropertyListComponent {
	@Input()
	properties: IImovel[];

	@Input()
	pageSize: number = 10;

	@Input()
	pageCount: number = 1;

	@Input()
	isLoading: boolean = false;

	@Input()
	onPaginate: Function | null = null;

	@Input()
	pageIndex: number = 0;

	@Input()
	showPaginator: boolean = false;

	@Input()
	totalRecords: number;

	startIndex: number = 0;
	endIndex: number = 10;

	constructor() {}

	ngOnInit() {
		// this.setListConfig();
		/*
		this.pageSize = this.ensureNumber(this.pageSize, 10);
		this.pageIndex = this.ensureNumber(this.pageIndex, 0);
		this.startIndex = 0;
		this.endIndex = this.startIndex + this.pageSize;

		if (this.totalRecords === null) this.totalRecords = this.properties.length;

		if (this.showPaginator === null)
			this.showPaginator = Math.floor(this.totalRecords / this.pageSize) > 1;

		*/

		this.startIndex = (this.pageIndex - 1) * this.pageSize;
		console.log('showPaginator', this.showPaginator);
		console.log('totalRecords', this.totalRecords);
		console.log('pageSize', this.pageSize);
	}

	setListConfig() {
		/*
		this.pageSize = this.ensureNumber(this.pageSize, 10);
		this.pageIndex = this.ensureNumber(this.pageIndex, 0);

		if (this.pageCount === null) {
			this.totalRecords = null;
		} else {
			this.pageCount = this.ensureNumber(this.pageCount, 1);
			this.totalRecords = this.pageCount * this.pageSize;
		}

		this.startIndex = this.pageIndex * this.pageSize;
		this.endIndex = this.startIndex + this.pageSize;

		if (this.showPaginator === null)
			this.showPaginator =
				this.pageIndex >
				Math.floor(this.ensureNumber(this.totalRecords, 0) / +this.pageSize);
	*/
	}

	ensureNumber(
		value: number | string | null,
		defaultValue: number = 0
	): number {
		value = value + '';
		if (!isNaN(+value)) {
			value = +value;
		} else {
			value = defaultValue;
		}

		return value;
	}

	paginate(event: any) {
		//event.first = Index of the first record
		//event.rows = Number of rows to display in new page
		//event.page = Index of the new page
		//event.pageCount = Total number of pages

		if (this.onPaginate) this.onPaginate(event);

		if (
			this.showPaginator === null &&
			this.totalRecords &&
			typeof this.pageSize !== 'string'
		)
			this.showPaginator = Math.floor(this.totalRecords / this.pageSize) > 1;

		console.debug('showPaginator', this.showPaginator);
		console.debug('totalRecords', this.totalRecords);
		console.debug('pageSize', this.pageSize);

		this.showPaginator = this.startIndex = event.first;
		this.endIndex = event.first + event.rows;
	}
}
