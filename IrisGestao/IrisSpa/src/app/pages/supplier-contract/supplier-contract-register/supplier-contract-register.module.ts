import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierContractRegisterRoutingModule } from './supplier-contract-register-routing.module';
import { SupplierContractRegisterComponent } from './supplier-contract-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';

@NgModule({
	declarations: [SupplierContractRegisterComponent],
	imports: [
		CommonModule,
		SupplierContractRegisterRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		FormStepsComponent,
		DropdownModule,
		ButtonModule,
		FileUploadModule,
		DialogModule,
		CalendarModule,
		InputTextModule,
		MultiSelectModule,
		SidebarModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ResponsiveDialogComponent,
		FileUploadComponent,
	],
})
export class SupplierContractRegisterModule {}
