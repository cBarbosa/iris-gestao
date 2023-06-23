import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { CpfCnpjPipeModule } from 'src/app/shared/pipes';
import { SidebarModule } from 'primeng/sidebar';
import { ReportRentValueComponent } from './report-rent-value.component';
import { ReportRentValueRoutingModule } from './report-rent-value-routing.module';

@NgModule({
	declarations: [ReportRentValueComponent],
	imports: [
		CommonModule,
		ReportRentValueRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputTextModule,
		ButtonModule,
		SpinnerComponent,
		SidebarModule,
		CpfCnpjPipeModule
	],
})
export class ReportRentValueModule {}
