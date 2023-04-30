import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRegisterRoutingModule } from './client-register-routing.module';
import { ClientRegisterComponent } from './client-register.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { NgxMaskModule } from 'ngx-mask';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { SidebarModule } from 'primeng/sidebar';
import { ContactRegisterSidebarComponent } from '../contact-register-sidebar/contact-register-sidebar.component';
import { TelefonePipeModule } from 'src/app/shared/pipes/telefone.module';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

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
		DialogModule,
		FormStepsComponent,
		NgxMaskModule.forChild(),
		SpinnerComponent,
		SidebarModule,
		ContactRegisterSidebarComponent,
		TelefonePipeModule,
		ResponsiveDialogComponent,
	],
})
export class ClientRegisterModule {}
