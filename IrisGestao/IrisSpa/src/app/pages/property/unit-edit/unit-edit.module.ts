import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitEditRoutingModule } from './unit-edit-routing.module';
import { UnitEditComponent } from './unit-edit.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [UnitEditComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		UnitEditRoutingModule,
		ButtonModule,
		InputTextModule,
		FileUploadModule,
		HttpClientModule,
	],
})
export class UnitEditModule {}
