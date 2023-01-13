import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentContractListingComponent } from './rent-contract-listing.component';

const routes: Routes = [
	{
		path: '',
		component: RentContractListingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentContractListingRoutingModule {}
