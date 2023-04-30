import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ReceivingPerformanceComponent } from './receiving-performance.component';
import { ReceivingPerformanceRoutingModule } from './receiving-performance-routing.module';
import { ChartModule } from 'primeng/chart';

@NgModule({
	declarations: [ReceivingPerformanceComponent],
	imports: [
		CommonModule,
		ReceivingPerformanceRoutingModule,
		SpinnerComponent,
		DropdownModule,
		InputTextModule,
		NgxMaskModule.forChild(),
		ButtonModule,
		CalendarModule,
		ChartModule
	],
})
export class ReceivingPerformanceModule { };
