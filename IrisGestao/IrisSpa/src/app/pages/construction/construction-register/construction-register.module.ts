import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionRegisterRoutingModule } from './construction-register-routing.module';
import { ConstructionRegisterComponent } from './construction-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
	declarations: [ConstructionRegisterComponent],
	imports: [
		CommonModule,
		ConstructionRegisterRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		FormStepsComponent,
		DropdownModule,
		ButtonModule,
		FileUploadModule,
		CalendarModule,
		InputTextModule,
		SidebarModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ResponsiveDialogComponent,
		MultiSelectModule,
	],
})
export class ConstructionRegisterModule {}
