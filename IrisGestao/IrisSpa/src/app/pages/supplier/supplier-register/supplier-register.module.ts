import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierRegisterRoutingModule } from './supplier-register-routing.module';
import { SupplierRegisterComponent } from './supplier-register.component';
import { TelefonePipeModule } from 'src/app/shared/pipes';
import { SidebarModule } from 'primeng/sidebar';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { NgxMaskModule } from 'ngx-mask';
import { FormStepsComponent } from 'src/app/shared/components/form-steps/form-steps.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ContactRegisterSidebarComponent } from '../../client/contact-register-sidebar/contact-register-sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

@NgModule({
	declarations: [SupplierRegisterComponent],
	imports: [
		CommonModule,
		SupplierRegisterRoutingModule,
		ReactiveFormsModule,
		ButtonModule,
		InputTextModule,
		CalendarModule,
		DropdownModule,
		FormStepsComponent,
		NgxMaskModule.forChild(),
		SpinnerComponent,
		SidebarModule,
		ContactRegisterSidebarComponent,
		TelefonePipeModule,
		ResponsiveDialogComponent,
	],
})
export class SupplierRegisterModule {}
