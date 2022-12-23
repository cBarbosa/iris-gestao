import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRegisterRoutingModule } from './property-register-routing.module';
import { PropertyRegisterComponent } from './property-register.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';

@NgModule({
	declarations: [PropertyRegisterComponent],
	imports: [
		CommonModule,
		PropertyRegisterRoutingModule,
		ReactiveFormsModule,
		InputTextModule,
		DropdownModule,
		FormStepsComponent,
		ButtonModule,
		FileUploadModule,
		DialogModule,
	],
})
export class PropertyRegisterModule {}
