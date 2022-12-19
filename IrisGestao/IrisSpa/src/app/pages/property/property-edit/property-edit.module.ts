import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyEditRoutingModule } from './property-edit-routing.module';
import { PropertyEditComponent } from './property-edit.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [PropertyEditComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		PropertyEditRoutingModule,
		ButtonModule,
		InputTextModule,
		FileUploadModule,
		HttpClientModule,
	],
})
export class PropertyEditModule {}
