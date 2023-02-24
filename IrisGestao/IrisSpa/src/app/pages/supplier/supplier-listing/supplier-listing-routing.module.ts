import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListingComponent } from './supplier-listing.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierListingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierListingRoutingModule {}
