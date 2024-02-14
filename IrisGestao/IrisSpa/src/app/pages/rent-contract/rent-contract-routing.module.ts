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
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA'
		},
	},
	{
		path: 'details/:guid',
		loadChildren: () =>
			import('./rent-contract-view/rent-contract-view.module').then(
				(m) => m.RentContractViewModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA'
		},
	},
	{
		path: 'register',
		loadChildren: () =>
			import('./rent-contract-register/rent-contract-register.module').then(
				(m) => m.RentContractRegisterModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA'
		},
	},
	{
		path: 'edit/:guid',
		loadChildren: () =>
			import('./rent-contract-edit/rent-contract-edit.module').then(
				(m) => m.RentContractEditModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA'
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentContractRoutingModule {}
