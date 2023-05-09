import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierContractViewComponent } from './supplier-contract-view.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierContractViewComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierContractViewRoutingModule {}
