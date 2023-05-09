import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierContractRegisterComponent } from './supplier-contract-register.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierContractRegisterComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierContractRegisterRoutingModule {}
