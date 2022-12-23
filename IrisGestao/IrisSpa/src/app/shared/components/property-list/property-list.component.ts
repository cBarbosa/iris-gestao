import { Component, Input } from '@angular/core';
import { PropertyItemModule } from '../property-item/property-item.module';
import { Imovel } from 'src/app/shared/models';
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
	properties: Imovel[];

	@Input()
	pageSize: number | string = 10;

	@Input()
	pageCount: number | string | null = null;

	@Input()
	isLoading: boolean = false;

	@Input()
	onPaginate: Function | null = null;

	@Input()
	pageIndex: number | string = 0;

	startIndex: number = 0;
	endIndex: number = 10;

	totalRecords: number | null = 0;

	showPaginator: boolean = false;

	constructor() {}

	ngOnInit() {
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

		this.showPaginator =
			this.pageIndex >
			Math.floor(this.ensureNumber(this.totalRecords, 0) / +this.pageSize);
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

		this.startIndex = event.first;
		this.endIndex = event.first + event.rows;
	}
}
