import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentContractEditRoutingModule } from './rent-contract-edit-routing.module';
import { RentContractEditComponent } from './rent-contract-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { NgxMaskModule } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxCurrencyModule } from 'ngx-currency';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { UnitSelectComponent } from 'src/app/shared/components/unit-select/unit-select.component';
import { AttachmentListComponent } from 'src/app/shared/components/attachment-list/attachment-list.component';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';

@NgModule({
	declarations: [RentContractEditComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RentContractEditRoutingModule,
		SpinnerComponent,
		DropdownModule,
		InputTextModule,
		DialogModule,
		NgxMaskModule.forChild(),
		NgxCurrencyModule,
		ButtonModule,
		CheckboxModule,
		AccordionModule,
		CalendarModule,
		UnitSelectComponent,
		UploadListComponent,
	],
})
export class RentContractEditModule {}
