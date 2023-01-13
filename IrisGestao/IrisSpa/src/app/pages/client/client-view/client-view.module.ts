import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpfCnpjPipeModule } from 'src/app/shared/pipes';

import { ClientViewRoutingModule } from './client-view-routing.module';
import { ClientViewComponent } from './client-view.component';
import { ButtonModule } from 'primeng/button';
import { PropertyItemModule } from 'src/app/shared/components/property-item/property-item.module';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { PropertyListComponent } from 'src/app/shared/components/property-list/property-list.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { TelefonePipeModule } from 'src/app/shared/pipes/telefone.module';
import { SidebarModule } from 'primeng/sidebar';
import { ContactDetailSidebarComponent } from '../contact-detail-sidebar/contact-detail-sidebar.component';
import { ContactEditSidebarComponent } from '../contact-edit-sidebar/contact-edit-sidebar.component';
import { CepPipeModule } from 'src/app/shared/pipes/cep.module';
import { DialogModule } from 'primeng/dialog';
import { ContactRegisterSidebarComponent } from '../contact-register-sidebar/contact-register-sidebar.component';

@NgModule({
	declarations: [ClientViewComponent],
	imports: [
		CommonModule,
		ClientViewRoutingModule,
		ButtonModule,
		PropertyItemModule,
		CpfCnpjPipeModule,
		SpinnerComponent,
		PropertyListComponent,
		TableModule,
		MenuModule,
		SidebarModule,
		DialogModule,
		ContactDetailSidebarComponent,
		ContactEditSidebarComponent,
		ContactRegisterSidebarComponent,
		TelefonePipeModule,
		CepPipeModule,
	],
})
export class ClientViewModule {}
