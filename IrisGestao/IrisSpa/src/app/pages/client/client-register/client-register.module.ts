import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRegisterRoutingModule } from './client-register-routing.module';
import { ClientRegisterComponent } from './client-register.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [ClientRegisterComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ClientRegisterRoutingModule,
		ButtonModule,
		InputTextModule,
		CalendarModule,
		DropdownModule,
	],
})
export class ClientRegisterModule {}
