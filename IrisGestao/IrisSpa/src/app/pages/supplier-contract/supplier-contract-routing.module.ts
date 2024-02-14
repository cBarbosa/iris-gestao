import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		loadChildren: () =>
			import(
				'./supplier-contract-listing/supplier-contract-listing.module'
			).then((m) => m.SupplierContractListingModule),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'details/:guid',
		loadChildren: () =>
			import('./supplier-contract-view/supplier-contract-view.module').then(
				(m) => m.SupplierContractViewModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'register',
		loadChildren: () =>
			import(
				'./supplier-contract-register/supplier-contract-register.module'
			).then((m) => m.SupplierContractRegisterModule),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'edit/:guid',
		loadChildren: () =>
			import('./supplier-contract-edit/supplier-contract-edit.module').then(
				(m) => m.SupplierContractEditModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierContractRoutingModule {}
