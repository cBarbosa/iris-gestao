import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierContractViewRoutingModule } from './supplier-contract-view-routing.module';
import { SupplierContractViewComponent } from './supplier-contract-view.component';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { CpfCnpjPipeModule, TelefonePipeModule } from 'src/app/shared/pipes';
import { CepPipeModule } from 'src/app/shared/pipes/cep.module';
import { PropertyListComponent } from 'src/app/shared/components/property-list/property-list.component';
import { IconModule } from 'src/app/shared/components/custom-ui/icon/icon.module';

@NgModule({
	declarations: [SupplierContractViewComponent],
	imports: [
		CommonModule,
		SupplierContractViewRoutingModule,
		ButtonModule,
		SpinnerComponent,
		PropertyListComponent,
		CpfCnpjPipeModule,
		TelefonePipeModule,
		CepPipeModule,
		IconModule,
	],
})
export class SupplierContractViewModule {}
