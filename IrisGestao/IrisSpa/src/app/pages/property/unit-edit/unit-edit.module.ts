import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitEditRoutingModule } from './unit-edit-routing.module';
import { UnitEditComponent } from './unit-edit.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { DropdownModule } from 'primeng/dropdown';

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
		DialogModule,
		DropdownModule,
		SpinnerComponent,
		NgxCurrencyModule,
		NgxMaskModule.forChild(),
	],
})
export class UnitEditModule {}
