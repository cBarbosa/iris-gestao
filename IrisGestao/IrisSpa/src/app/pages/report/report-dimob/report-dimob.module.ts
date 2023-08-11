import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportDimobRoutingModule } from './report-dimob-routing.module';
import { ReportDimobComponent } from './report-dimob.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ReportDimobComponent
  ],
  imports: [
    CommonModule,
    ReportDimobRoutingModule,
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
export class ReportDimobModule { }
