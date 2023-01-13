import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentContractRegisterRoutingModule } from './rent-contract-register-routing.module';
import { RentContractRegisterComponent } from './rent-contract-register.component';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
	declarations: [RentContractRegisterComponent],
	imports: [
		CommonModule,
		RentContractRegisterRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		FormStepsComponent,
		DropdownModule,
		ButtonModule,
		CheckboxModule,
		FileUploadModule,
		DialogModule,
		CalendarModule,
		SidebarModule,
		MultiSelectModule,
		InputTextModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
	],
})
export class RentContractRegisterModule {}
