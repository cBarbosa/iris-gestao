import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagedAreaRoutingModule } from './managed-area-routing.module';
import { ManagedAreaComponent } from './managed-area.component';
import { PercentChartCardComponent } from 'src/app/shared/components/percent-chart-card/percent-chart-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';

@NgModule({
	declarations: [ManagedAreaComponent],
	imports: [
		CommonModule,
		FormsModule,
		ManagedAreaRoutingModule,
		PercentChartCardComponent,
		SidebarModule,
		DropdownModule,
		CalendarModule,
		SpinnerComponent,
	],
})
export class ManagedAreaModule {}
