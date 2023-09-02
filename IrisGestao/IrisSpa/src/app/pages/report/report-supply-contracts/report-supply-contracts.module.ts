import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportSupplyContractsRoutingModule } from './report-supply-contracts-routing.module';
import { ReportSupplyContractsComponent } from './report-supply-contracts.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { PillTabComponent } from 'src/app/shared/components/pill-tab/pill-tab.component';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  declarations: [
    ReportSupplyContractsComponent
  ],
  imports: [
    CommonModule,
    ReportSupplyContractsRoutingModule,
    FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputTextModule,
		ButtonModule,
		SpinnerComponent,
    CardItemComponent,
		CalendarModule,
    MenuModule,
    PillTabComponent,
    TabViewModule
  ]
})
export class ReportSupplyContractsModule { }
