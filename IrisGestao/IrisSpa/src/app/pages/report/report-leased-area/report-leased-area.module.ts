import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { ReportLeasedAreaRoutingModule } from './report-leased-area-routing.module';
import { ReportLeasedAreaComponent } from './report-leased-area.component';
import { AreaPipeModule, CpfCnpjPipeModule } from 'src/app/shared/pipes';
import { SidebarModule } from 'primeng/sidebar';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';

@NgModule({
	declarations: [ReportLeasedAreaComponent],
	imports: [
		CommonModule,
		ReportLeasedAreaRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputTextModule,
		ButtonModule,
		SpinnerComponent,
		SidebarModule,
		CpfCnpjPipeModule,
		AreaPipeModule,
		CardItemComponent,
	],
})
export class ReportLeasedAreaModule {}
