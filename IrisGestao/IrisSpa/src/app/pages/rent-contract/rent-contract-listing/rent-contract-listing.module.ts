import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentContractListingRoutingModule } from './rent-contract-listing-routing.module';
import { RentContractListingComponent } from './rent-contract-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { MenuModule } from 'primeng/menu';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
	declarations: [RentContractListingComponent],
	imports: [
		CommonModule,
		RentContractListingRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputTextModule,
		ButtonModule,
		SpinnerComponent,
		MenuModule,
		CalendarModule,
	],
})
export class RentContractListingModule {}
