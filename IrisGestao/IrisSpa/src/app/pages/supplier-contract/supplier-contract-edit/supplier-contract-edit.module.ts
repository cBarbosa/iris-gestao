import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierContractEditRoutingModule } from './supplier-contract-edit-routing.module';
import { SupplierContractEditComponent } from './supplier-contract-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { InputTextModule } from 'primeng/inputtext';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';

@NgModule({
	declarations: [SupplierContractEditComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		ResponsiveDialogComponent,
		SupplierContractEditRoutingModule,
		DropdownModule,
		SpinnerComponent,
		CalendarModule,
		ButtonModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		UploadListComponent,
		InputTextModule,
	],
})
export class SupplierContractEditModule {}
