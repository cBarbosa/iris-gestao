import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpfCnpjPipeModule } from 'src/app/shared/pipes';

import { ClientViewRoutingModule } from './client-view-routing.module';
import { ClientViewComponent } from './client-view.component';
import { ButtonModule } from 'primeng/button';
import { PropertyItemModule } from 'src/app/shared/components/property-item/property-item.module';

@NgModule({
	declarations: [ClientViewComponent],
	imports: [
		CommonModule,
		ClientViewRoutingModule,
		ButtonModule,
		PropertyItemModule,
		CpfCnpjPipeModule,
	],
})
export class ClientViewModule {}
