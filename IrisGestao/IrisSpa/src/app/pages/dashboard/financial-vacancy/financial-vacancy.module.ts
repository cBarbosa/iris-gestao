import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { NgxMaskModule } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FinancialVacancyComponent } from './financial-vacancy.component';
import { FinancialVacancyRoutingModule } from './financial-vacancy-routing.module';
import { ChartModule } from 'primeng/chart';

@NgModule({
	declarations: [FinancialVacancyComponent],
	imports: [
		CommonModule,
		FinancialVacancyRoutingModule,
		SpinnerComponent,
		DropdownModule,
		NgxMaskModule.forChild(),
		ButtonModule,
		CalendarModule,
		ChartModule
	],
})
export class FinancialVacancyModule { };
