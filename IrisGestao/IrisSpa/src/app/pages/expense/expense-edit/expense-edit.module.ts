import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseEditRoutingModule } from './expense-edit-routing.module';
import { ExpenseEditComponent } from './expense-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

@NgModule({
	declarations: [ExpenseEditComponent],
	imports: [
		CommonModule,
		ExpenseEditRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		SpinnerComponent,
		DropdownModule,
		InputTextModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ButtonModule,
		CalendarModule,
		ResponsiveDialogComponent,
	],
})
export class ExpenseEditModule {}
