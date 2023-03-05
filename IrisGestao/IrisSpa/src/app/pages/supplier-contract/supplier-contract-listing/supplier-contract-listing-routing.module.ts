import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierContractListingComponent } from './supplier-contract-listing.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierContractListingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierContractListingRoutingModule {}
