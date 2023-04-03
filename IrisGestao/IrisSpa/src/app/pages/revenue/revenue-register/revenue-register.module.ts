import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevenueRegisterRoutingModule } from './revenue-register-routing.module';
import { RevenueRegisterComponent } from './revenue-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

@NgModule({
	declarations: [RevenueRegisterComponent],
	imports: [
		CommonModule,
		RevenueRegisterRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		FormStepsComponent,
		DropdownModule,
		ButtonModule,
		CalendarModule,
		InputTextModule,
		// SidebarModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ResponsiveDialogComponent,
		// MultiSelectModule,
	],
})
export class RevenueRegisterModule {}
