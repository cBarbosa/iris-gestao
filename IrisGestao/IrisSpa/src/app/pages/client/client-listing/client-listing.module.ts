import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListingComponent } from './client-listing.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ClientListingRoutingModule } from './client-listing-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CpfCnpjPipeModule } from 'src/app/shared/pipes';

@NgModule({
	declarations: [ClientListingComponent],
	imports: [
		CommonModule,
		DropdownModule,
		TableModule,
		TagModule,
		InputTextModule,
		ButtonModule,
		ClientListingRoutingModule,
		CpfCnpjPipeModule,
	],
})
export class ClientListingModule {}
