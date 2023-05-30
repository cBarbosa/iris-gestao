import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierContractEditComponent } from './supplier-contract-edit.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierContractEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierContractEditRoutingModule {}
