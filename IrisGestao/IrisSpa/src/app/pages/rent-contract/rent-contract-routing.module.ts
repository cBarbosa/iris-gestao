import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		loadChildren: () =>
			import('./rent-contract-listing/rent-contract-listing.module').then(
				(m) => m.RentContractListingModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'details',
		loadChildren: () =>
			import('./rent-contract-view/rent-contract-view.module').then(
				(m) => m.RentContractViewModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentContractRoutingModule {}
