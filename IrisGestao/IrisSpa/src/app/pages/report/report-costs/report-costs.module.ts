import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCostsRoutingModule } from './report-costs-routing.module';
import { ReportCostsComponent } from './report-costs.component';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';

import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [ReportCostsComponent],
  imports: [
    CommonModule,
    ReportCostsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
		SpinnerComponent,
    DropdownModule,
    MenuModule,
    CalendarModule
  ]
})
export class ReportCostsModule { }
