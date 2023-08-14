import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommercialRoutingModule } from './commercial-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { CalendarModule } from 'primeng/calendar';
import { CommercialComponent } from './commercial.component';
import { CpfCnpjPipeModule } from 'src/app/shared/pipes';


@NgModule({
  declarations: [
    CommercialComponent
  ],
  imports: [
    CommonModule,
    CommercialRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
		SpinnerComponent,
    DropdownModule,
    MenuModule,
    CalendarModule,
    CpfCnpjPipeModule
  ]
})
export class CommercialModule { }
