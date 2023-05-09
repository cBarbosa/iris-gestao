import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseListingRoutingModule } from './expense-listing-routing.module';
import { ExpenseListingComponent } from './expense-listing.component';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
	declarations: [ExpenseListingComponent],
	imports: [
		CommonModule,
		ExpenseListingRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		CardItemComponent,
		TableModule,
		DropdownModule,
		InputTextModule,
		ButtonModule,
		SidebarModule,
		SpinnerComponent,
	],
})
export class ExpenseListingModule {}
