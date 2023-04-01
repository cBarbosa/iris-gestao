import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionListingRoutingModule } from './construction-listing-routing.module';
import { ConstructionListingComponent } from './construction-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

@NgModule({
	declarations: [ConstructionListingComponent],
	imports: [
		CommonModule,
		ConstructionListingRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputTextModule,
		ButtonModule,
		SpinnerComponent,
		CardItemComponent,
		SidebarModule,
		ResponsiveDialogComponent,
	],
})
export class ConstructionListingModule {}
