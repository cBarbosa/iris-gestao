import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionEditRoutingModule } from './construction-edit-routing.module';
import { ConstructionEditComponent } from './construction-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';

@NgModule({
	declarations: [ConstructionEditComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ConstructionEditRoutingModule,
		SpinnerComponent,
		DropdownModule,
		InputTextModule,
		DialogModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ButtonModule,
		AccordionModule,
		CalendarModule,
		UploadListComponent,
	],
})
export class ConstructionEditModule {}
