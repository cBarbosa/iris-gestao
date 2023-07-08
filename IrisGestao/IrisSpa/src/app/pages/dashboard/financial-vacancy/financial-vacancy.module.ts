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
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { PillTabComponent } from 'src/app/shared/components/pill-tab/pill-tab.component';
import { SidebarModule } from 'primeng/sidebar';
import { PercentChartCardComponent } from 'src/app/shared/components/percent-chart-card/percent-chart-card.component';

@NgModule({
	declarations: [FinancialVacancyComponent],
	imports: [
		CommonModule,
		FormsModule,
		FinancialVacancyRoutingModule,
		SpinnerComponent,
		DropdownModule,
		NgxMaskModule.forChild(),
		ButtonModule,
		CalendarModule,
		ChartModule,
		ChartComponent,
		InputTextModule,
		TabViewModule,
		PillTabComponent,
		SidebarModule,
		PercentChartCardComponent,
	],
})
export class FinancialVacancyModule {}
