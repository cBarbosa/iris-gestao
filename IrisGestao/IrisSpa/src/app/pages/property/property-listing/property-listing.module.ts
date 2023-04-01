import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyListingComponent } from './property-listing.component';
import { PropertyItemModule } from '../../../shared/components/property-item/property-item.module';
import { PropertyListingRoutingModule } from './property-listing-routing.module';
import { CstmDropdownModule } from 'src/app/shared/components/custom-ui/dropdown/dropdown.module';
import { CstmInputTextModule } from 'src/app/shared/components/custom-ui/directives/input-text/input-text.module';
import { CstmButtonModule } from 'src/app/shared/components/custom-ui/directives/button/button.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PropertyListComponent } from 'src/app/shared/components/property-list/property-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
	declarations: [PropertyListingComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PropertyListingRoutingModule,
		PropertyItemModule,
		InputTextModule,
		CstmInputTextModule,
		CstmDropdownModule,
		CstmButtonModule,
		ButtonModule,
		DropdownModule,
		PropertyListComponent,
		SidebarModule,
	],
})
export class PropertyListingModule {}
