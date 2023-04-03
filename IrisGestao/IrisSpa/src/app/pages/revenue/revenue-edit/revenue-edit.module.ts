import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevenueEditRoutingModule } from './revenue-edit-routing.module';
import { RevenueEditComponent } from './revenue-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
	declarations: [RevenueEditComponent],
	imports: [
		CommonModule,
		RevenueEditRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		SpinnerComponent,
		DropdownModule,
		InputTextModule,
		DialogModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ButtonModule,
		CalendarModule,
	],
})
export class RevenueEditModule {}
