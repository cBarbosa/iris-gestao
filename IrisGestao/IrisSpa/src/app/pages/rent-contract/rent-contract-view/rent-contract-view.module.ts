import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentContractViewRoutingModule } from './rent-contract-view-routing.module';
import { RentContractViewComponent } from './rent-contract-view.component';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { TableModule } from 'primeng/table';
import { CpfCnpjPipeModule } from 'src/app/shared/pipes';
import { TelefonePipeModule } from 'src/app/shared/pipes/telefone.module';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { IconModule } from 'src/app/shared/components/custom-ui/icon/icon.module';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

@NgModule({
	declarations: [RentContractViewComponent],
	imports: [
		CommonModule,
		FormsModule,
		RentContractViewRoutingModule,
		SpinnerComponent,
		TableModule,
		CpfCnpjPipeModule,
		TelefonePipeModule,
		ButtonModule,
		AccordionModule,
		IconModule,
		SidebarModule,
		InputTextModule,
		ResponsiveDialogComponent,
		NgxMaskModule.forChild(),
	],
})
export class RentContractViewModule {}
