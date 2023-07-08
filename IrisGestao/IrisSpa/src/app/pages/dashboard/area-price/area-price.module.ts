import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaPriceRoutingModule } from './area-price-routing.module';
import { AreaPriceComponent } from './area-price.component';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { NgxMaskModule } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
	declarations: [AreaPriceComponent],
	imports: [
		CommonModule,
		AreaPriceRoutingModule,
		FormsModule,
		SpinnerComponent,
		DropdownModule,
		NgxMaskModule.forChild(),
		ButtonModule,
		CalendarModule,
		ChartModule,
		ChartComponent,
		InputTextModule,
		SidebarModule,
	],
})
export class AreaPriceModule {}
