import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpfCnpjPipeModule } from 'src/app/shared/pipes';

import { ClientViewRoutingModule } from './client-view-routing.module';
import { ClientViewComponent } from './client-view.component';
import { ButtonModule } from 'primeng/button';
import { PropertyItemModule } from 'src/app/shared/components/property-item/property-item.module';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';

@NgModule({
	declarations: [ClientViewComponent],
	imports: [
		CommonModule,
		ClientViewRoutingModule,
		ButtonModule,
		PropertyItemModule,
		CpfCnpjPipeModule,
		SpinnerComponent,
	],
})
export class ClientViewModule {}
