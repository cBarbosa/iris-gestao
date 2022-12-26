import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRegisterRoutingModule } from './unit-register-routing.module';
import { UnitRegisterComponent } from './unit-register.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
	declarations: [UnitRegisterComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		UnitRegisterRoutingModule,
		ButtonModule,
		InputTextModule,
		FileUploadModule,
		HttpClientModule,
		DropdownModule,
		DialogModule,
		NgxCurrencyModule
	],
})
export class UnitRegisterModule {}
