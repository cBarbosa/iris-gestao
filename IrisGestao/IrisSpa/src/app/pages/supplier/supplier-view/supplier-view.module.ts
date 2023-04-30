import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierViewRoutingModule } from './supplier-view-routing.module';
import { CepPipeModule } from 'src/app/shared/pipes/cep.module';
import { ButtonModule } from 'primeng/button';
import { PropertyItemModule } from 'src/app/shared/components/property-item/property-item.module';
import { CpfCnpjPipeModule, TelefonePipeModule } from 'src/app/shared/pipes';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { PropertyListComponent } from 'src/app/shared/components/property-list/property-list.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { ContactDetailSidebarComponent } from '../../client/contact-detail-sidebar/contact-detail-sidebar.component';
import { ContactEditSidebarComponent } from '../../client/contact-edit-sidebar/contact-edit-sidebar.component';
import { ContactRegisterSidebarComponent } from '../../client/contact-register-sidebar/contact-register-sidebar.component';
import { SupplierViewComponent } from './supplier-view.component';
import { PanelModule } from 'primeng/panel';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';

@NgModule({
	declarations: [SupplierViewComponent],
	imports: [
		CommonModule,
		SupplierViewRoutingModule,
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
		PanelModule,
		CardItemComponent,
	],
})
export class SupplierViewModule {}
