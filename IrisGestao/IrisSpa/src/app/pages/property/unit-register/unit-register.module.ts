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
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { NgxMaskModule } from 'ngx-mask';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';

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
		NgxCurrencyModule,
		SpinnerComponent,
		NgxMaskModule,
		TabViewModule,
		SidebarModule,
	],
})
export class UnitRegisterModule {}
