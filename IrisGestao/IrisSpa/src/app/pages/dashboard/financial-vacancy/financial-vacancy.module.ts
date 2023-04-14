import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FinancialVacancyComponent } from './financial-vacancy.component';
import { FinancialVacancyRoutingModule } from './financial-vacancy-routing.module';

@NgModule({
	declarations: [FinancialVacancyComponent],
	imports: [
		CommonModule,
		FinancialVacancyRoutingModule,
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
export class FinancialVacancyModule { };
