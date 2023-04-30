import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierContractListingRoutingModule } from './supplier-contract-listing-routing.module';
import { SupplierContractListingComponent } from './supplier-contract-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { MenuModule } from 'primeng/menu';
import { CpfCnpjPipeModule } from 'src/app/shared/pipes';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
	declarations: [SupplierContractListingComponent],
	imports: [
		CommonModule,
		SupplierContractListingRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		InputTextModule,
		TableModule,
		ButtonModule,
		SpinnerComponent,
		MenuModule,
		CpfCnpjPipeModule,
		CardItemComponent,
		SidebarModule,
	],
})
export class SupplierContractListingModule {}
