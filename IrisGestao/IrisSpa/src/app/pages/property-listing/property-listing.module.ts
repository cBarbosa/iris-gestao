import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyListingComponent } from './property-listing.component';
import { PropertyItemModule } from './property-item/property-item.module';
import { PropertyListingRoutingModule } from './property-listing-routing.module';
import { CstmDropdownModule } from 'src/app/shared/components/custom-ui/dropdown/dropdown.module';
import { CstmInputTextModule } from 'src/app/shared/components/custom-ui/directives/input-text/input-text.module';
import { CstmButtonModule } from 'src/app/shared/components/custom-ui/directives/button/button.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
	declarations: [PropertyListingComponent],
	imports: [
		CommonModule,
		PropertyListingRoutingModule,
		PropertyItemModule,
		InputTextModule,
		CstmInputTextModule,
		CstmDropdownModule,
		CstmButtonModule,
		ButtonModule,
	],
})
export class PropertyListingModule {}
